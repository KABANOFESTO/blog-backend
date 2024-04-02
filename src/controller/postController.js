import Database from "../Database/models";
import { uploadToCloud } from "../helper/cloud";
import { Sequelize } from "sequelize";


const User = Database["Users"];
const Post = Database["Posts"];
const Comment = Database["Comments"];
const Reply = Database["Replies"];
const Likes = Database["Likes"];
const unLikes = Database["unLikes"];
// adding the post

export const addPost = async (req, res) => {
  try {
    const loggedUser = req.loggedInUser.id;
    const { postTitle, postImage, postContent } = req.body;

    if (!postTitle || !postContent) {
      return res.status(400).json({
        status: "400",
        message: "Some fields are empty",
      });
    }

    const checkTitle = await Post.findOne({ where: { postTitle: req.body.postTitle } });
    if (checkTitle) {
      return res.status(400).json({
        status: "400",
        message: "Post title exists in the database",
      });
    }

    let savedPostImage;
    if (req.file) savedPostImage = await uploadToCloud(req.file, res);
    console.log(savedPostImage);

    const post = await Post.create({
      postTitle,
      postImage: savedPostImage?.secure_url,
      postContent,
      userId: loggedUser, 
    });
    const getPosts = await Post.findAll({
      attributes: [
        
        'id',
        'postTitle',
        'postImage',
        'postContent',
        'views',
        'createdAt',
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "Likes"
            WHERE "Likes"."postId" = "Posts"."id"
          )`),
          'allLikes',
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "unLikes"
            WHERE "unLikes"."postId" = "Posts"."id"
          )`),
          'allUnlikes',
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "Comments"
            WHERE "Comments"."postId" = "Posts"."id"
          )`),
          'allComents',
        ],
      ],
      include: [
        {
          model: User,
          as: 'postedBy',
          attributes: ['firstName','lastName','profile','email','role','createdAt'],
        },

        {
          model: Comment,
          attributes: ['commentBody','createdAt','updatedAt'],
          include: [
            {
              model: User,
              as: 'CommentedBy',
              attributes: ['firstName','lastName','profile','email','role','createdAt'],
            },
            {
              model: Reply,
              attributes: ['replyMessage','createdAt','updatedAt'],
              include: [
                {
                  model: User,
                  as: 'repliedBy',
                  attributes: ['firstName','lastName','profile','email','role','createdAt'],
                },
              ],
            },
          ],
        },
        {
          model: Likes,
          attributes: ['createdAt'],
          include:[
            {
              model: User,
              as: 'likedBy',
              attributes: ['firstName','lastName','profile','email','role','createdAt'],
            }
          ]
        },
        {
          model: unLikes,
          attributes: ['createdAt'],
          include:[
            {
              model: User,
              as: 'unLikedBy',
              attributes: ['firstName','lastName','profile','email','role','createdAt'],
            }
          ]
        }
      ],
    });
    

    return res.status(201).json({
      status: "201",
      message: "Post created successfully by",
      data: getPosts,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      console.error("Validation errors:", error.errors);
    } else {
      console.error("Unhandled error:", error);
    }
    return res.status(500).json({
      status: "500",
      message: "Failed to create a post",
      error: error.message,
    });
  }
};





// getting all posts

export const getAllPosts = async (req, res) =>{
    try {
      const getPosts = await Post.findAll({
        attributes: [
          
          'id',
          'postTitle',
          'postImage',
          'postContent',
          'views',
          'createdAt',
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "Likes"
              WHERE "Likes"."postId" = "Posts"."id"
            )`),
            'allLikes',
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "unLikes"
              WHERE "unLikes"."postId" = "Posts"."id"
            )`),
            'allUnlikes',
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "Comments"
              WHERE "Comments"."postId" = "Posts"."id"
            )`),
            'allComents',
          ],
        ],
        include: [
          {
            model: User,
            as: 'postedBy',
            attributes: ['firstName','lastName','profile','email','role','createdAt'],
          },

          {
            model: Comment,
            attributes: ['commentBody','createdAt','updatedAt'],
            include: [
              {
                model: User,
                as: 'CommentedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              },
              {
                model: Reply,
                attributes: ['replyMessage','createdAt','updatedAt'],
                include: [
                  {
                    model: User,
                    as: 'repliedBy',
                    attributes: ['firstName','lastName','profile','email','role','createdAt'],
                  },
                ],
              },
            ],
          },
          {
            model: Likes,
            attributes: ['createdAt'],
            include:[
              {
                model: User,
                as: 'likedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              }
            ]
          },
          {
            model: unLikes,
            attributes: ['createdAt'],
            include:[
              {
                model: User,
                as: 'unLikedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              }
            ]
          }
        ],
      });
      
        return res.status(201).json({
            status: "201",
            message: "Posts retrieved successfully",
            data: getPosts,
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "Failed to retrieve a post",
            error: error.message,
        });
    }
};

// Get a specific post by ID
export const getSinglePost = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the post
      const getPost = await Post.findByPk(id,{
        attributes: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "Likes"
              WHERE "Likes"."postId" = "Posts"."id"
            )`),
            'totalLikes',
          ],
          'id',
          'postTitle',
          'postImage',
          'postContent',
          'views',
          'createdAt',
        ],
        include: [
          {
            model: User,
            as: 'postedBy',
            attributes: ['firstName','lastName','profile','email','role','createdAt'],
          },

          {
            model: Comment,
            attributes: ['commentBody','createdAt','updatedAt'],
            include: [
              {
                model: User,
                as: 'CommentedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              },
              {
                model: Reply,
                attributes: ['replyMessage','createdAt','updatedAt'],
                include: [
                  {
                    model: User,
                    as: 'repliedBy',
                    attributes: ['firstName','lastName','profile','email','role','createdAt'],
                  },
                ],
              },
            ],
          },
          {
            model: Likes,
            attributes: ['createdAt'],
            include:[
              {
                model: User,
                as: 'likedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              }
            ]
          },
          {
            model: unLikes,
            attributes: ['createdAt'],
            include:[
              {
                model: User,
                as: 'unLikedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              }
            ]
          }
        ],
      });
  
      if (!getPost) {
        return res.status(404).json({
          status: "404",
          message: "Post not found",
        });
      }
  
      // Increment the views
      getPost.views = getPost.views + 1; // Increment views by 1
  
      // Save the updated post with the incremented views
      await getPost.save();
  
      return res.status(200).json({
        status: "200",
        message: "Post retrieved successfully",
        data: getPost,
      });
    } catch (error) {
      return res.status(500).json({
        status: "500",
        message: "Failed to retrieve post",
        error: error.message,
      });
    }
  };

  // updatind a post
  export const updatePost = async (req,res) =>{
    try {
      const {id} = req.params;
      const {postTitle,postImage,postContent} = req.body;
      const checkPostId = await Post.findByPk(id);
      if(!checkPostId){
        return res.status(404).json({
          status: "404",
          message: "Post not found",
        });
      }
      const checkPostTitle = await Post.findOne({where: {postTitle:req.body.postTitle}});
      if(checkPostTitle){
        if(checkPostTitle.id != id){
          return res.status(400).json({
            status: "400",
            message: "This post title exists in database",
          });
        }
      }
      let saveUpdatedImage;
      if(req.file) saveUpdatedImage = await uploadToCloud(req.file, res);
      const values ={
        postTitle,postImage:saveUpdatedImage?. secure_url,postContent
      }
      const updatedPost = await Post.update(values,{where:{id:id}});
      const getPosts = await Post.findAll({
        attributes: [
          
          'id',
          'postTitle',
          'postImage',
          'postContent',
          'views',
          'createdAt',
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "Likes"
              WHERE "Likes"."postId" = "Posts"."id"
            )`),
            'allLikes',
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "unLikes"
              WHERE "unLikes"."postId" = "Posts"."id"
            )`),
            'allUnlikes',
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "Comments"
              WHERE "Comments"."postId" = "Posts"."id"
            )`),
            'allComents',
          ],
        ],
        include: [
          {
            model: User,
            as: 'postedBy',
            attributes: ['firstName','lastName','profile','email','role','createdAt'],
          },

          {
            model: Comment,
            attributes: ['commentBody','createdAt','updatedAt'],
            include: [
              {
                model: User,
                as: 'CommentedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              },
              {
                model: Reply,
                attributes: ['replyMessage','createdAt','updatedAt'],
                include: [
                  {
                    model: User,
                    as: 'repliedBy',
                    attributes: ['firstName','lastName','profile','email','role','createdAt'],
                  },
                ],
              },
            ],
          },
          {
            model: Likes,
            attributes: ['createdAt'],
            include:[
              {
                model: User,
                as: 'likedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              }
            ]
          },
          {
            model: unLikes,
            attributes: ['createdAt'],
            include:[
              {
                model: User,
                as: 'unLikedBy',
                attributes: ['firstName','lastName','profile','email','role','createdAt'],
              }
            ]
          }
        ],
      });
      return res.status(201).json({
        status: "201",
        message: "Post update success",
        posts:getPosts
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Unhandled error:", error);
      }
      return res.status(500).json({
        status: "500",
        message: "Failed to update a post",
        error: error.message,
      });
      
    }
  };

  // deleting a post

  export const deletePost = async (req, res) =>{
    try {
      const {id} = req.params;
      const checkPostId = await Post.findByPk(id);
      if(!checkPostId){
        return res.status(404).json({
          status: "404",
          message: "Post not found",
        });
      }
      const deletedPost = await Post.destroy({where:{id:id}});
      return res.status(200).json({
        status: "200",
        message: "Post with this ID "+ req.params.id+ " deleted successfully",
        data: checkPostId,
      })
    } catch (error) {
      if(error.name === "SequelizeValidationError"){
        console.log("Validation error:" ,error.errors);
      }else{
        console.log("Unhandled error:",error);
      }
      return res.status(500).json({
        status: "500",
        message: "Failed to delete a post",
        error: error.message,
      });
      }
  }

