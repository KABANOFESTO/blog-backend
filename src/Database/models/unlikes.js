import mongoose from 'mongoose';

const unLikeSchema = new mongoose.Schema({
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

// Create compound index to ensure one unlike per user per post
unLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Virtual population for relationships
unLikeSchema.virtual('unLikedPost', {
  ref: 'Posts',
  localField: 'postId',
  foreignField: '_id',
  justOne: true
});

unLikeSchema.virtual('unLikedBy', {
  ref: 'Users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Middleware to handle cascade delete (simulating Sequelize's onDelete: 'CASCADE')
unLikeSchema.pre('deleteMany', async function(next) {
  // This middleware handles when a post or user is deleted
  const conditions = this.getFilter();
  if (conditions.postId) {
    // If a post is deleted, all its unlikes will be deleted automatically
    await mongoose.model('unLikes').deleteMany({ postId: conditions.postId });
  }
  if (conditions.userId) {
    // If a user is deleted, all their unlikes will be deleted automatically
    await mongoose.model('unLikes').deleteMany({ userId: conditions.userId });
  }
  next();
});

// Ensure virtuals are included when converting to JSON
unLikeSchema.set('toJSON', { virtuals: true });
unLikeSchema.set('toObject', { virtuals: true });

const unLikes = mongoose.model('unLikes', unLikeSchema);

export default unLikes;