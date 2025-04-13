import mongoose from 'mongoose';
const { Schema } = mongoose;

const messagesSchema = new Schema({
  names: {
    type: String,
    required: false // Matching Sequelize's optional behavior
  },
  email: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're adding timestamps manually to match Sequelize behavior
});

// Adding the associate method to maintain compatibility
messagesSchema.statics.associate = function(models) {
  // Associations would be defined here if needed
};

const Messages = mongoose.model('Messages', messagesSchema);


export default Messages;


