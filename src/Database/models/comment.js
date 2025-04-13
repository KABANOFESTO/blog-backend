import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
  commentBody: {
    type: String,
    required: true
  },
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
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Replies',
  localField: '_id',
  foreignField: 'commentId'
});

commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

commentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

commentSchema.statics.associate = function(models) {
  this.belongsTo(models.Posts, {
    foreignKey: "postId",
    onDelete: "CASCADE",
    as: "posts"
  });
  this.belongsTo(models.Users, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "CommentedBy"
  });
  this.hasMany(models.Replies, {
    foreignKey: 'commentId'
  });
};

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;