import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this blog post'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug for this blog post'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this blog post'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this blog post']
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide a cover image for this blog post']
  },
  tags: {
    type: [String],
    default: []
  },
  youtubeVideo: {
    type: String,
    default: ''
  },
  relatedDocs: {
    type: [
      {
        name: String,
        url: String,
        embed: {
          type: Boolean,
          default: false
        }
      }
    ],
    default: []
  },
  readingTime: {
    type: Number,
    default: 5
  },
  published: {
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

// Create a text index for search functionality
BlogSchema.index({ title: 'text', description: 'text', content: 'text' });

// Calculate reading time before saving
BlogSchema.pre('save', function(next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema); 