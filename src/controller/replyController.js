import User from "../Database/models/user.js";
import Post from "../Database/models/post.js";
import Comment from "../Database/models/comment.js";
import Replies from "../Database/models/reply.js";

export const addReply = async (req,res) =>{
    try {
        const {id} = req.params;
        const loggedInUser = req.loggedInUser.id;
        const { replyMessage } = req.body;
        const checkCommentId = await Comment.findByPk(id);
        if(!checkCommentId){
            return res.status(404).json({
                status: "404",
                message: "Comment not found",
            });
        }
        const makeReply = await Replies.create({
            commentId:id,
            replyMessage,
            userId: loggedInUser,
        });
        return res.status(201).json({
            status: "201",
            message: "Your reply added",
            data: makeReply,
        })
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.error("Validation errors:", error.errors);
          } else {
            console.error("Unhandled error:", error);
          }
          return res.status(500).json({
            status: "500",
            message: "Failed to add a reply",
            error: error.message,
          });
        
    }
};
// getting all replies

export const getAll = async(req,res) =>{
    try {
        const getReplies = await Replies.findAll({
            include: [
                {
                  model: Comment,
                  as: 'comment',
                  attributes: ['commentBody', 'createdAt', 'updatedAt'],
                  include: [
                    {
                      model: User,
                      as: 'CommentedBy',
                      attributes: ['firstName', 'lastName', 'email', 'profile'],
                    },
                    {
                      model: Post,
                      as: 'posts',
                      attributes: ['postTitle', 'postImage', 'postContent'],
                      include: {
                        model: User,
                        as: 'postedBy',
                        attributes: ['firstName', 'lastName', 'email', 'profile'],
                      },
                    },
                  ],
                },
                {
                  model: User,
                  as: 'repliedBy',
                  attributes: ['firstName', 'lastName', 'email', 'profile'],
                },
              ],
        });
        return res.status(200).json({
            status: "200",
            message: "Replies retrieved successfully",
            data: getReplies,
          });
        
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.error("Validation errors:", error.errors);
          } else {
            console.error("Unhandled error:", error);
          }
          return res.status(500).json({
            status: "500",
            message: "Failed to retrieve replies",
            error: error.message,
          });
    }
}

// getting a reply  by reply id

export const getReply = async (req, res) => {
    try {
      const { id } = req.params;
      const getSingleReply = await Replies.findByPk(id, {
        include: [
          {
            model: Comment,
            as: 'comment',
            attributes: ['commentBody', 'createdAt', 'updatedAt'],
            include: [
              {
                model: User,
                as: 'CommentedBy',
                attributes: ['firstName', 'lastName', 'email', 'profile'],
              },
              {
                model: Post,
                as: 'posts',
                attributes: ['postTitle', 'postImage', 'postContent'],
                include: {
                  model: User,
                  as: 'postedBy',
                  attributes: ['firstName', 'lastName', 'email', 'profile'],
                },
              },
            ],
          },
          {
            model: User,
            as: 'repliedBy',
            attributes: ['firstName', 'lastName', 'email', 'profile'],
          },
        ],
      });
  
      if (!getSingleReply) {
        return res.status(404).json({
          status: "404",
          message: "Reply not found",
        });
      }
  
      return res.status(200).json({
        status: "200",
        message: "Reply retrieved successfully",
        data: getSingleReply,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Unhandled error:", error);
      }
      return res.status(500).json({
        status: "500",
        message: "Failed to retrieve a reply",
        error: error.message,
      });
    }
  };

  // deleting a reply

  export const deleteReply = async (req, res) =>{
    try {
      const {id} = req.params;
      const checkReplyId = await Replies.findByPk(id);
      if(!checkReplyId){
        return res.status(404).json({
          status: "404",
          message: "Reply not found",
        });
      }
      const deletedReply = await Replies.destroy({where:{id:id}});
      return res.status(200).json({
        status: "200",
        message: "Reply with this ID "+ req.params.id+ " deleted successfully",
        data: checkReplyId,
      })
    } catch (error) {
      if(error.name === "SequelizeValidationError"){
        console.log("Validation error:" ,error.errors);
      }else{
        console.log("Unhandled error:",error);
      }
      return res.status(500).json({
        status: "500",
        message: "Failed to delete a reply",
        error: error.message,
      });
      }
  }