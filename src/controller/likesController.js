import Like from "../Database/models/likes.js";
import Unlike from "../Database/models/unlikes.js";

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.loggedInUser.id;
    
    // Check if user already liked the post
    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      // If like exists, remove it
      await Like.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ message: "Your like removed" });
    }
    
    // Check if user previously disliked the post
    const existingDislike = await Unlike.findOne({ postId, userId });
    if (existingDislike) {
      // Remove the dislike if exists
      await Unlike.deleteOne({ _id: existingDislike._id });
    }
    
    // Create new like
    await Like.create({ postId, userId });
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

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.loggedInUser.id;
    
    // Check if user already disliked the post
    const existingUnlike = await Unlike.findOne({ postId, userId });

    if (existingUnlike) {
      // If unlike exists, remove it
      await Unlike.deleteOne({ _id: existingUnlike._id });
      return res.status(200).json({ message: "Your dislike removed" });
    }
    
    // Check if user previously liked the post
    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      // Remove the like if exists
      await Like.deleteOne({ _id: existingLike._id });
    }
    
    // Create new unlike
    await Unlike.create({ postId, userId });
    return res.status(200).json({ message: "Your dislike added" });

  } catch (error) {
    console.error("Error in unlikePost:", error);
    return res.status(500).json({
      status: "500",
      message: "Failed to add or remove dislike",
      error: error.message,
    });
  }
};