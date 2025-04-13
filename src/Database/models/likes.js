import mongoose from 'mongoose';
const likeSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index to ensure unique like per user per post
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Virtual population and other relationships can be handled through these
likeSchema.virtual('likedPost', {
  ref: 'Posts',
  localField: 'postId',
  foreignField: '_id',
  justOne: true
});

likeSchema.virtual('likedBy', {
  ref: 'Users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are included when converting to JSON
likeSchema.set('toJSON', { virtuals: true });
likeSchema.set('toObject', { virtuals: true });

const Likes = mongoose.model('Likes', likeSchema);

export default Likes;