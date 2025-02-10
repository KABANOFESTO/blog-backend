import Database from "../Database/models";
import { uploadToCloud } from "../helper/cloud";
import { Sequelize } from "sequelize";

const { Posts, Users } = require('../Database/models');
const path = require('path');
const fs = require('fs');


const User = Database["Users"];
const Post = Database["Posts"];
const Comment = Database["Comments"];
const Reply = Database["Replies"];
const Likes = Database["Likes"];
const unLikes = Database["unLikes"];

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = ['FAITH & SPIRITUALITY', 'PERSONAL GROWTH', 'GROWTH & SELF DISCOVERY', 'KINDNESS & COMPASSION', 'VLOG'];

    return res.status(200).json({
      status: "200",
      message: "Categories retrieved successfully",
      data: categories
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve categories",
      error: error.message
    });
  }
};

// Add a new post
exports.addPost = async (req, res) => {
  try {
    const loggedUser = req.loggedInUser.id;
    const { postTitle, postContent, category } = req.body;

    // Input validation
    if (!postTitle?.trim() || !postContent?.trim() || !category) {
      return res.status(400).json({
        status: "400",
        message: "Title, content, and category are required",
      });
    }

    // Category validation
    const validCategories = [
      'FAITH & SPIRITUALITY',
      'PERSONAL GROWTH & SELF DISCOVERY',
      'KINDNESS & COMPASSION',
      'VLOG'
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid category",
      });
    }

    // Check for duplicate title
    const checkTitle = await Posts.findOne({  // Update Post to Posts
      where: {
        postTitle: postTitle.trim()
      }
    });

    if (checkTitle) {
      return res.status(400).json({
        status: "400",
        message: "Post title already exists",
      });
    }

    // Handle file upload
    let postImage = null;
    if (req.file) {
      try {
        // Upload to cloudinary
        const result = await uploadToCloud(req.file);
        postImage = result.secure_url;
      } catch (error) {
        console.error('File upload error:', error);
        return res.status(500).json({
          status: "500",
          message: "Failed to upload file",
          error: error.message
        });
      }
    }

    // Create post
    const post = await Posts.create({
      postTitle: postTitle.trim(),
      postImage,
      postContent: postContent.trim(),
      category,
      userId: loggedUser,
    });

    // Fetch created post with user details
    const createdPost = await Posts.findByPk(post.id, {
      include: [{
        model: Users,  // Update User to Users
        as: 'postedBy',
        attributes: ['id', 'firstName', 'lastName', 'email', 'profile']
      }]
    });

    return res.status(201).json({
      status: "201",
      message: "Post created successfully",
      data: createdPost
    });

  } catch (error) {
    console.error('Post creation error:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to create post",
      error: error.message
    });
  }
};

// Get all posts with optional category filter
export const getAllPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const whereClause = category ? { category } : {};

    const getPosts = await Post.findAll({
      where: whereClause,
      attributes: getDefaultAttributes(),
      include: getDefaultIncludes(),
    });

    if (getPosts.length === 0 && category) {
      return res.status(404).json({
        status: "404",
        message: `No posts found in category: ${category}`,
      });
    }

    return res.status(200).json({
      status: "200",
      message: "Posts retrieved successfully",
      data: getPosts,
    });
  } catch (error) {
    handleError(error, res, "Failed to retrieve posts");
  }
};

// Get posts by specific category
export const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const posts = await Post.findAll({
      where: { category },
      attributes: getDefaultAttributes(),
      include: getDefaultIncludes(),
    });

    if (posts.length === 0) {
      return res.status(404).json({
        status: "404",
        message: `No posts found in category: ${category}`,
      });
    }

    return res.status(200).json({
      status: "200",
      message: `Posts in category ${category} retrieved successfully`,
      data: posts,
    });
  } catch (error) {
    handleError(error, res, "Failed to retrieve posts");
  }
};

// Get a single post
export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const getPost = await Post.findByPk(id, {
      attributes: getDefaultAttributes(),
      include: getDefaultIncludes(),
    });

    if (!getPost) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }

    getPost.views += 1;
    await getPost.save();

    return res.status(200).json({
      status: "200",
      message: "Post retrieved successfully",
      data: getPost,
    });
  } catch (error) {
    handleError(error, res, "Failed to retrieve post");
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { postTitle, postImage, postContent, category } = req.body;

    const checkPostId = await Post.findByPk(id);
    if (!checkPostId) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }

    const checkPostTitle = await Post.findOne({ where: { postTitle: req.body.postTitle } });
    if (checkPostTitle && checkPostTitle.id != id) {
      return res.status(400).json({
        status: "400",
        message: "This post title exists in database",
      });
    }

    let saveUpdatedImage;
    if (req.file) saveUpdatedImage = await uploadToCloud(req.file, res);

    const values = {
      postTitle,
      postImage: saveUpdatedImage?.secure_url,
      postContent,
      category
    };

    await Post.update(values, { where: { id } });

    const getPosts = await Post.findAll({
      attributes: getDefaultAttributes(),
      include: getDefaultIncludes(),
    });

    return res.status(200).json({
      status: "200",
      message: "Post updated successfully",
      posts: getPosts
    });
  } catch (error) {
    handleError(error, res, "Failed to update post");
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const checkPostId = await Post.findByPk(id);
    if (!checkPostId) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }

    await Post.destroy({ where: { id } });

    return res.status(200).json({
      status: "200",
      message: `Post with ID ${id} deleted successfully`,
      data: checkPostId,
    });
  } catch (error) {
    handleError(error, res, "Failed to delete post");
  }
};

// Helper functions
const getDefaultAttributes = () => [
  'id',
  'postTitle',
  'postImage',
  'postContent',
  'category',
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
    'allComments',
  ],
];

const getDefaultIncludes = () => [
  {
    model: User,
    as: 'postedBy',
    attributes: ['firstName', 'lastName', 'profile', 'email', 'role', 'createdAt'],
  },
  {
    model: Comment,
    attributes: ['commentBody', 'createdAt', 'updatedAt'],
    include: [
      {
        model: User,
        as: 'CommentedBy',
        attributes: ['firstName', 'lastName', 'profile', 'email', 'role', 'createdAt'],
      },
      {
        model: Reply,
        attributes: ['replyMessage', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            as: 'repliedBy',
            attributes: ['firstName', 'lastName', 'profile', 'email', 'role', 'createdAt'],
          },
        ],
      },
    ],
  },
  {
    model: Likes,
    attributes: ['createdAt'],
    include: [
      {
        model: User,
        as: 'likedBy',
        attributes: ['firstName', 'lastName', 'profile', 'email', 'role', 'createdAt'],
      }
    ]
  },
  {
    model: unLikes,
    attributes: ['createdAt'],
    include: [
      {
        model: User,
        as: 'unLikedBy',
        attributes: ['firstName', 'lastName', 'profile', 'email', 'role', 'createdAt'],
      }
    ]
  }
];

const handleError = (error, res, defaultMessage) => {
  if (error.name === "SequelizeValidationError") {
    console.error("Validation errors:", error.errors);
  } else {
    console.error("Unhandled error:", error);
  }
  return res.status(500).json({
    status: "500",
    message: defaultMessage,
    error: error.message,
  });
};