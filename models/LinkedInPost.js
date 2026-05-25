import mongoose from 'mongoose';

const LinkedInPostSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide a LinkedIn post URL'],
  },
  tag: {
    type: String,
    enum: ['tech', 'career', 'project', 'other'],
    default: 'other'
  },
  featured: {
    type: Boolean,
    default: false
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

export default mongoose.models.LinkedInPost || mongoose.model('LinkedInPost', LinkedInPostSchema);
