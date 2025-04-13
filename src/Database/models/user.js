
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  profile: String,
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
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
userSchema.virtual('posts', {
  ref: 'Posts',
  localField: '_id',
  foreignField: 'userId'
});

userSchema.virtual('comments', {
  ref: 'Comments',
  localField: '_id',
  foreignField: 'userId'
});

userSchema.virtual('replies', {
  ref: 'Replies',
  localField: '_id',
  foreignField: 'userId'
});

// Middleware to update timestamp
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Cascade delete middleware
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const userId = this._id;
  // Delete all associated posts, comments, and replies
  await Promise.all([
    mongoose.model('Posts').deleteMany({ userId }),
    mongoose.model('Comments').deleteMany({ userId }),
    mongoose.model('Replies').deleteMany({ userId })
  ]);
  next();
});

// Ensure virtuals are included when converting to JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password; // Never send password in JSON responses
    return ret;
  }
});
userSchema.set('toObject', { virtuals: true });

const Users = mongoose.model('Users', userSchema);

export default Users;