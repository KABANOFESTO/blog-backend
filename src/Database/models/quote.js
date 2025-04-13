import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  quoteText: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
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

// Virtual for user relationship (replaces Sequelize association)
quoteSchema.virtual('user', {
  ref: 'Users',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Include virtuals in JSON output
quoteSchema.set('toJSON', { virtuals: true });
quoteSchema.set('toObject', { virtuals: true });

// Update timestamp on save
quoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);


export default Quote;