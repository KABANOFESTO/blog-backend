// controllers/videoController.js
import Database from "../Database/models";
const cloudinary = require('../helper/cloudinary');
import { Sequelize } from "sequelize";
const User = Database["Users"];
const Post = Database["Posts"];
const Comment = Database["Comments"];
const Reply = Database["Replies"];
const Likes = Database["Likes"];
const unLikes = Database["unLikes"];

exports.uploadVideo = async (req, res) => {
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
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video'
    });
    const post = await Post.create({
      postTitle,
      postImage: result?.secure_url,
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

    // If you need to store the Cloudinary video ID in your database, you can do it here.

    return res.status(201).json({
      status: "201",
      message: "Post created successfully by",
      data: getPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
