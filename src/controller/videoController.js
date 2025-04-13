import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from "../Database/models/user.js";
import Post from "../Database/models/post.js";
import Comment from "../Database/models/comment.js";
import Like from "../Database/models/likes.js";
import Unlike from "../Database/models/unlikes.js";
import cloudinary from '../helper/cloudinary.js';

// Configure file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadVideo = async (req, res) => {
  try {
    const { id: userId } = req.loggedInUser;
    const { postTitle, postContent, category } = req.body;

    // Validate required fields
    if (!postTitle?.trim() || !postContent?.trim()) {
      return res.status(400).json({
        status: "400",
        message: "Title and content are required",
      });
    }

    // Check for duplicate title
    const existingPost = await Post.findOne({ postTitle: postTitle.trim() });
    if (existingPost) {
      return res.status(409).json({
        status: "409",
        message: "Post title already exists",
      });
    }

    // Validate video file
    if (!req.file) {
      return res.status(400).json({ 
        status: "400",
        message: 'No video file uploaded' 
      });
    }

    if (!req.file.mimetype.startsWith('video/')) {
      fs.unlinkSync(req.file.path);
      return res.status(415).json({
        status: "415",
        message: 'Only video files are allowed'
      });
    }

    // Validate file size (max 100MB)
    if (req.file.size > 100 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(413).json({
        status: "413",
        message: 'Video file too large (max 100MB)'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      chunk_size: 6000000, // 6MB chunks
      folder: 'blog-videos'
    });

    // Create new video post
    const videoPost = await Post.create({
      postTitle: postTitle.trim(),
      postContent: postContent.trim(),
      postImage: result.secure_url,
      cloudinaryId: result.public_id,
      userId,
      category,
      isVideo: true,
      videoDuration: result.duration,
      videoFormat: result.format
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    // Get populated post data
    const populatedPost = await Post.findById(videoPost._id)
      .populate('userId', 'firstName lastName profile email')
      .populate('comments')
      .populate('likes')
      .populate('unlikes');

    return res.status(201).json({
      status: "201",
      message: "Video post created successfully",
      data: populatedPost
    });

  } catch (error) {
    // Clean up temp file if error occurs
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Video upload error:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to upload video",
      error: error.message
    });
  }
};

export const getVideoPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const videoPosts = await Post.find({ isVideo: true })
      .populate('userId', 'firstName lastName profile email')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'firstName lastName profile'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalVideos = await Post.countDocuments({ isVideo: true });

    return res.status(200).json({
      status: "200",
      message: "Video posts retrieved successfully",
      data: videoPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalVideos / limit),
        totalVideos
      }
    });

  } catch (error) {
    console.error('Error getting video posts:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve video posts",
      error: error.message
    });
  }
};

export const getSingleVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid video ID"
      });
    }

    // Increment views and get video
    const video = await Post.findOneAndUpdate(
      { _id: id, isVideo: true },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('userId', 'firstName lastName profile email')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'firstName lastName profile'
        }
      });

    if (!video) {
      return res.status(404).json({
        status: "404",
        message: "Video post not found"
      });
    }

    // Get engagement metrics
    const [likesCount, unlikesCount, commentsCount] = await Promise.all([
      Like.countDocuments({ postId: id }),
      Unlike.countDocuments({ postId: id }),
      Comment.countDocuments({ postId: id })
    ]);

    const videoWithMetrics = {
      ...video.toObject(),
      likesCount,
      unlikesCount,
      commentsCount
    };

    return res.status(200).json({
      status: "200",
      message: "Video post retrieved successfully",
      data: videoWithMetrics
    });

  } catch (error) {
    console.error('Error getting single video:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve video post",
      error: error.message
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.loggedInUser;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid video ID"
      });
    }

    const video = await Post.findOne({ _id: id, isVideo: true });

    if (!video) {
      return res.status(404).json({
        status: "404",
        message: "Video post not found"
      });
    }

    // Check authorization
    if (video.userId.toString() !== userId && role !== 'admin') {
      return res.status(403).json({
        status: "403",
        message: "Unauthorized to delete this video"
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.cloudinaryId, {
      resource_type: 'video'
    });

    // Delete associated data
    await Promise.all([
      Comment.deleteMany({ postId: id }),
      Like.deleteMany({ postId: id }),
      Unlike.deleteMany({ postId: id })
    ]);

    // Delete video post
    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      status: "200",
      message: "Video post deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to delete video post",
      error: error.message
    });
  }
};

export const updateVideoDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.loggedInUser;
    const { postTitle, postContent, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid video ID"
      });
    }

    const video = await Post.findOne({ _id: id, isVideo: true });

    if (!video) {
      return res.status(404).json({
        status: "404",
        message: "Video post not found"
      });
    }

    // Check ownership
    if (video.userId.toString() !== userId) {
      return res.status(403).json({
        status: "403",
        message: "Unauthorized to update this video"
      });
    }

    // Update video details
    video.postTitle = postTitle || video.postTitle;
    video.postContent = postContent || video.postContent;
    video.category = category || video.category;
    video.updatedAt = new Date();

    await video.save();

    return res.status(200).json({
      status: "200",
      message: "Video details updated successfully",
      data: video
    });

  } catch (error) {
    console.error('Error updating video details:', error);
    return res.status(500).json({
      status: "500",
      message: "Failed to update video details",
      error: error.message
    });
  }
};

export default {
  uploadVideo,
  getVideoPosts,
  getSingleVideo,
  deleteVideo,
  updateVideoDetails
};