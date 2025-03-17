import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  user: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  replyCount: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 3 // Limit nesting to 3 levels deep
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
CommentSchema.index({ blogId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });

// Virtual for replies
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId',
  options: { sort: { createdAt: 1 } }
});

// Set toJSON option to include virtuals
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema); 