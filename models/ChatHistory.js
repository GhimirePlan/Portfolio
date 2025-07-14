import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Message text is required']
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: [true, 'Sender is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false, // Optional for anonymous users
    index: true
  },
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    index: true
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ChatHistorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.ChatHistory || mongoose.model('ChatHistory', ChatHistorySchema);