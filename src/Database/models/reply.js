import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  replyMessage: {
    type: String,
    required: true
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comments',
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

// Virtual population for relationships
replySchema.virtual('repliedBy', {
  ref: 'Users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

replySchema.virtual('comment', {
  ref: 'Comments',
  localField: 'commentId',
  foreignField: '_id',
  justOne: true
});

// Middleware to update the updatedAt timestamp
replySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure virtuals are included when converting to JSON
replySchema.set('toJSON', { virtuals: true });
replySchema.set('toObject', { virtuals: true });

const Replies = mongoose.model('Replies', replySchema);


export default Replies;