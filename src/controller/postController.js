import Post from "../Database/models/post.js";
import User from "../Database/models/user.js";
import Comment from "../Database/models/comment.js";
import Like from "../Database/models/likes.js";
import Unlike from "../Database/models/unlikes.js";
import { uploadToCloud } from "../helper/cloud.js";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get directory path - Fix for import.meta issue
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Add this to your postController.js (at the bottom before the exports)
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Check if like already exists
    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
      // Remove the like
      await Like.deleteOne({ _id: existingLike._id });
      
      // Decrement likes count on post
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      
      return res.status(200).json({ message: "Your like removed" });
    }

    // Check if dislike exists and remove it
    const existingDislike = await Unlike.findOne({ post: postId, user: userId });
    if (existingDislike) {
      await Unlike.deleteOne({ _id: existingDislike._id });
      await Post.findByIdAndUpdate(postId, { $inc: { unlikesCount: -1 } });
    }

    // Create new like
    await Like.create({ post: postId, user: userId });
    
    // Increment likes count on post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    return res.status(200).json({ message: "Your like added" });

  } catch (error) {
    console.error("Error in likePost:", error);
    return res.status(500).json({
      status: "500",
      message: "Failed to add or remove like",
      error: error.message,
    });
  }
};

export const unLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Check if unlike already exists
    const existingUnlike = await Unlike.findOne({ post: postId, user: userId });

    if (existingUnlike) {
      // Remove the unlike
      await Unlike.deleteOne({ _id: existingUnlike._id });
      
      // Decrement unlikes count on post
      await Post.findByIdAndUpdate(postId, { $inc: { unlikesCount: -1 } });
      
      return res.status(200).json({ message: "Your dislike removed" });
    }

    // Check if like exists and remove it
    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
    }

    // Create new unlike
    await Unlike.create({ post: postId, user: userId });
    
    // Increment unlikes count on post
    await Post.findByIdAndUpdate(postId, { $inc: { unlikesCount: 1 } });

    return res.status(200).json({ message: "Your dislike added" });

  } catch (error) {
    console.error("Error in unLikePost:", error);
    return res.status(500).json({
      status: "500",
      message: "Failed to add or remove dislike",
      error: error.message,
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = [
      'FAITH & SPIRITUALITY', 
      'PERSONAL GROWTH', 
      'GROWTH & SELF DISCOVERY', 
      'KINDNESS & COMPASSION', 
      'VLOG'
    ];

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

// Rest of the file remains unchanged
export const addPost = async (req, res) => {
  try {
    const loggedUser = req.user._id; // Changed from req.loggedInUser
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
    const checkTitle = await Post.findOne({
      postTitle: postTitle.trim()
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
    const post = await Post.create({
      postTitle: postTitle.trim(),
      postImage,
      postContent: postContent.trim(),
      category,
      author: loggedUser,
    });

    // Populate author details
    const createdPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName email profile');

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
    const filter = category ? { category } : {};

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName profile')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'firstName lastName profile'
        }
      })
      .populate({
        path: 'likes',
        populate: {
          path: 'user',
          select: 'firstName lastName profile'
        }
      })
      .populate({
        path: 'unlikes',
        populate: {
          path: 'user',
          select: 'firstName lastName profile'
        }
      });

    if (category && posts.length === 0) {
      return res.status(404).json({
        status: "404",
        message: `No posts found in category: ${category}`,
      });
    }

    // Add counts to each post
    const postsWithCounts = await Promise.all(posts.map(async post => {
      const likesCount = await Like.countDocuments({ post: post._id });
      const unlikesCount = await Unlike.countDocuments({ post: post._id });
      const commentsCount = await Comment.countDocuments({ post: post._id });
      
      return {
        ...post.toObject(),
        likesCount,
        unlikesCount,
        commentsCount
      };
    }));

    return res.status(200).json({
      status: "200",
      message: "Posts retrieved successfully",
      data: postsWithCounts,
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve posts",
      error: error.message
    });
  }
};

// Get posts by specific category
export const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const posts = await Post.find({ category })
      .populate('author', 'firstName lastName profile')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'firstName lastName profile'
        }
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
    console.error('Error getting posts by category:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve posts",
      error: error.message
    });
  }
};

// Get a single post
export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid post ID",
      });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'firstName lastName profile')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'author',
            select: 'firstName lastName profile'
          },
          {
            path: 'replies',
            populate: {
              path: 'author',
              select: 'firstName lastName profile'
            }
          }
        ]
      })
      .populate({
        path: 'likes',
        populate: {
          path: 'user',
          select: 'firstName lastName profile'
        }
      })
      .populate({
        path: 'unlikes',
        populate: {
          path: 'user',
          select: 'firstName lastName profile'
        }
      });

    if (!post) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }

    // Get counts
    const likesCount = await Like.countDocuments({ post: post._id });
    const unlikesCount = await Unlike.countDocuments({ post: post._id });
    const commentsCount = await Comment.countDocuments({ post: post._id });

    const postWithCounts = {
      ...post.toObject(),
      likesCount,
      unlikesCount,
      commentsCount
    };

    return res.status(200).json({
      status: "200",
      message: "Post retrieved successfully",
      data: postWithCounts,
    });
  } catch (error) {
    console.error('Error getting single post:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve post",
      error: error.message
    });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { postTitle, postContent, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: "403",
        message: "You can only update your own posts",
      });
    }

    // Check for duplicate title
    if (postTitle) {
      const existingPost = await Post.findOne({ 
        postTitle: postTitle.trim(),
        _id: { $ne: id } // Exclude current post
      });
      
      if (existingPost) {
        return res.status(400).json({
          status: "400",
          message: "This post title already exists",
        });
      }
    }

    // Handle file upload
    let updatedImage;
    if (req.file) {
      updatedImage = await uploadToCloud(req.file);
    }

    const updateData = {
      postTitle: postTitle || post.postTitle,
      postContent: postContent || post.postContent,
      category: category || post.category,
      postImage: updatedImage ? updatedImage.secure_url : post.postImage
    };

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { 
      new: true 
    }).populate('author', 'firstName lastName profile');

    return res.status(200).json({
      status: "200",
      message: "Post updated successfully",
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to update post",
      error: error.message
    });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        status: "404",
        message: "Post not found",
      });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: "403",
        message: "You can only delete your own posts",
      });
    }

    // Delete all related data
    await Promise.all([
      Comment.deleteMany({ post: id }),
      Like.deleteMany({ post: id }),
      Unlike.deleteMany({ post: id })
    ]);

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      status: "200",
      message: `Post with ID ${id} deleted successfully`,
      data: post
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to delete post",
      error: error.message
    });
  }
};