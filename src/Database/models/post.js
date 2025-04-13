import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: true,
    trim: true
  },
  postImage: String,
  postContent: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['FAITH & SPIRITUALITY', 'PERSONAL GROWTH & SELF DISCOVERY', 'KINDNESS & COMPASSION', 'VLOG'],
    uppercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual population for relationships
postSchema.virtual('postedBy', {
  ref: 'Users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

postSchema.virtual('comments', {
  ref: 'Comments',
  localField: '_id',
  foreignField: 'postId'
});

postSchema.virtual('likes', {
  ref: 'Likes',
  localField: '_id',
  foreignField: 'postId'
});

postSchema.virtual('unLikes', {
  ref: 'unLikes',
  localField: '_id',
  foreignField: 'postId'
});

// Ensure virtual fields are included when converting to JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Add timestamp middleware
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Posts = mongoose.model('Posts', postSchema);

export default Posts;

