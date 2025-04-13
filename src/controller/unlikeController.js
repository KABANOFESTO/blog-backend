import Unlike from "../Database/models/unlikes.js";
import Like from "../Database/models/likes.js";

// Dislike a post
export const disLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.loggedInUser.id;

    // Check if dislike already exists
    const existingDislike = await Unlike.findOne({ postId, userId });

    if (existingDislike) {
      // Remove the dislike
      await Unlike.deleteOne({ _id: existingDislike._id });
      return res.status(200).json({ message: "Your dislike removed" });
    }

    // Check if like exists and remove it
    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
    }

    // Create new dislike
    await Unlike.create({ postId, userId });
    return res.status(200).json({ message: "Post disliked" });

  } catch (error) {
    console.error("Error in disLikePost:", error);
    return res.status(500).json({
      status: "500",
      message: "Failed to add or remove dislike",
      error: error.message,
    });
  }
};