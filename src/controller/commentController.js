import Database from "../Database/models/comment.js";
import { Sequelize } from "sequelize";

const Post = Database["Posts"];
const User = Database["Users"];
const Comment = Database["Comments"]
const Replies = Database["Replies"];
const Likes = Database["Likes"];
const unLikes = Database["unLikes"];

export const addComment = async (req,res) =>{
    try {
        const {id} = req.params;
        const loggedInUser = req.loggedInUser.id;
        const {commentBody} = req.body;
        const checkPostId = await Post.findByPk(id);
        if(!checkPostId){
            return res.status(404).json({
                status: "404",
                message: "Post not found",
            });
        }
        const makeComment = await Comment.create({
            postId:id,
            commentBody,
            userId: loggedInUser,
        });
        return res.status(201).json({
            status: "201",
            message: "Your comment added",
            data: makeComment,
        })
    } catch (error) {
        if(error.name === "SequelizeValidationError"){
            console.log("Validation error:" ,error.errors);
          }else{
            console.log("Unhandled error:",error);
          }
          return res.status(500).json({
            status: "500",
            message: "Failed to add a comment",
            error: error.message,
          });
    }
};

//getting comments

export const getAllComments = async (req,res) =>{
    try {
        const getComments = await Comment.findAll({
          attributes: [
          
            'id',
            'commentBody',
            'createdAt',
            [
              Sequelize.literal(`(
                SELECT COUNT(*) 
                FROM "Replies"
                WHERE "Replies"."commentId" = "Comments"."id"
              )`),
              'allReplies',
            ],
          ],
            include: [
                {   model: Replies, 
                  attributes: ['replyMessage', 'createdAt', 'updatedAt'],
                  include: {
                      model: User,
                      as: 'repliedBy', 
                      attributes: ['firstName', 'lastName', 'email', 'profile','createdAt'],
                  }
                },
                {
                    model: User,
                    as: 'CommentedBy', 
                    attributes: ['firstName', 'lastName', 'email', 'profile','createdAt'],
                
                },
                {
                    model: Post,
                    as: 'posts',
                    attributes: ['postTitle','postImage','postContent','views','createdAt'],
                    include:[ {
                      model: User,
                      as: 'postedBy', 
                      attributes: ['firstName', 'lastName', 'email', 'profile','createdAt'],
                  },
                  {
                    model: Likes,
                    attributes: ['createdAt'],
                  },
                  
                    {
                      model: unLikes,
                      attributes: ['createdAt'],
                    }
                  ]
                },
                ]
        });
        return res.status(201).json({
            status: "201",
            message: "Comments retrieved successfully",
            data: getComments,
        })
    } catch (error) {
        if(error.name === "SequelizeValidationError"){
            console.log("Validation error:" ,error.errors);
          }else{
            console.log("Unhandled error:",error);
          }
          return res.status(500).json({
            status: "500",
            message: "Failed to retrieve comments",
            error: error.message,
          });
        
    }
};
// getting single comment by comment id

export const getSingleComment = async (req,res) =>{
    try {
        const {id} = req.params;
        const getComment = await Comment.findByPk(id,{
          attributes: [
          
            'id',
            'commentBody',
            'createdAt',
            [
              Sequelize.literal(`(
                SELECT COUNT(*) 
                FROM "Replies"
                WHERE "Replies"."commentId" = "Comments"."id"
              )`),
              'allReplies',
            ],
          ],
            include: [
              {
                  model: User,
                  as: 'CommentedBy', 
                  attributes: ['firstName', 'lastName', 'email', 'profile','createdAt'],
                  
              },
              {   model: Replies, 
                  attributes: ['replyMessage', 'createdAt', 'updatedAt'],
                  include: {
                      model: User,
                      as: 'repliedBy', 
                      attributes: ['firstName', 'lastName', 'email', 'profile','createdAt'],
                  }
              },
                {
                    model: Post,
                    as: 'posts',
                    attributes: ['postTitle','postImage','postContent','views','createdAt'],
                    include:[ {
                        model: User,
                        as: 'postedBy', 
                        attributes: ['firstName', 'lastName', 'email', 'profile','createdAt'],
                    },
                    {
                      model: Likes,
                      attributes: ['createdAt'],
                    },
                    
                      {
                        model: unLikes,
                        attributes: ['createdAt'],
                      }
                    ]
                },
                ]
        });
        if(!getComment){
            return res.status(404).json({
                status: "404",
                message: "Comment not found",
              });
        }
            return res.status(200).json({
                status: "200",
                message: "Comment retrieved successfully",
                data: getComment,
              });
    
        
    } catch (error) {
        if(error.name === "SequelizeValidationError"){
            console.log("Validation error:" ,error.errors);
          }else{
            console.log("Unhandled error:",error);
          }
          return res.status(500).json({
            status: "500",
            message: "Failed to retrieve a comment",
            error: error.message,
          });
    }
};

// deleting a comment

export const deleteComment = async (req, res) =>{
    try {
      const {id} = req.params;
      const checkCommentId = await Comment.findByPk(id);
      if(!checkCommentId){
        return res.status(404).json({
          status: "404",
          message: "Comment not found",
        });
      }
      const deletedComment = await Comment.destroy({where:{id:id}});
      return res.status(200).json({
        status: "200",
        message: "Comment with this ID "+ req.params.id+ " deleted successfully",
        data: checkCommentId,
      })
    } catch (error) {
      if(error.name === "SequelizeValidationError"){
        console.log("Validation error:" ,error.errors);
      }else{
        console.log("Unhandled error:",error);
      }
      return res.status(500).json({
        status: "500",
        message: "Failed to delete a comment",
        error: error.message,
      });
      }
  }