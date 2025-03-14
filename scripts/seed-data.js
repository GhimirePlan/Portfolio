// This script seeds the MongoDB database with initial data
// Run with: node scripts/seed-data.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Define models directly in this script to avoid import issues
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date
});

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  content: String,
  coverImage: String,
  tags: [String],
  readingTime: Number,
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
});

// Calculate reading time before saving
BlogSchema.pre('save', function(next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// Sample data
const sampleBlogs = [
  {
    title: 'Getting Started with Next.js',
    slug: 'getting-started-with-nextjs',
    description: 'Learn how to build modern web applications with Next.js',
    content: `
      <h2>Introduction to Next.js</h2>
      <p>Next.js is a React framework that enables server-side rendering and static site generation.</p>
      <p>It provides a great developer experience with features like:</p>
      <ul>
        <li>File-system based routing</li>
        <li>API routes</li>
        <li>Built-in CSS and Sass support</li>
        <li>Fast refresh</li>
        <li>Code splitting and bundling</li>
      </ul>
      <h2>Getting Started</h2>
      <p>To create a new Next.js app, run the following command:</p>
      <pre><code>npx create-next-app my-app</code></pre>
      <p>This will create a new Next.js app in the my-app directory.</p>
      <h2>Pages and Routing</h2>
      <p>Next.js uses a file-system based router. Files in the pages directory automatically become routes.</p>
      <p>For example, pages/index.js becomes the / route, and pages/about.js becomes the /about route.</p>
    `,
    coverImage: 'https://via.placeholder.com/800x400?text=Next.js',
    tags: ['nextjs', 'react', 'javascript'],
    published: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    title: 'Styling with Tailwind CSS',
    slug: 'styling-with-tailwind-css',
    description: 'A guide to using Tailwind CSS for rapid UI development',
    content: `
      <h2>Introduction to Tailwind CSS</h2>
      <p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML.</p>
      <p>It provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.</p>
      <h2>Installation</h2>
      <p>To install Tailwind CSS, run the following command:</p>
      <pre><code>npm install tailwindcss</code></pre>
      <p>Then, create a configuration file:</p>
      <pre><code>npx tailwindcss init</code></pre>
      <h2>Using Tailwind CSS</h2>
      <p>Tailwind provides utility classes for almost everything you need:</p>
      <ul>
        <li>Layout</li>
        <li>Typography</li>
        <li>Colors</li>
        <li>Spacing</li>
        <li>Flexbox</li>
        <li>Grid</li>
        <li>And much more</li>
      </ul>
    `,
    coverImage: 'https://via.placeholder.com/800x400?text=Tailwind+CSS',
    tags: ['tailwind', 'css', 'design'],
    published: true,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20')
  },
  {
    title: 'Building a Portfolio Website',
    slug: 'building-a-portfolio-website',
    description: 'How to create a professional portfolio website to showcase your work',
    content: `
      <h2>Why You Need a Portfolio</h2>
      <p>A portfolio website is essential for developers and designers to showcase their skills and projects.</p>
      <p>It serves as a central hub for your professional online presence and helps you stand out to potential employers or clients.</p>
      <h2>Planning Your Portfolio</h2>
      <p>Before building your portfolio, consider:</p>
      <ul>
        <li>Your target audience</li>
        <li>The projects you want to showcase</li>
        <li>The skills you want to highlight</li>
        <li>Your personal brand and style</li>
      </ul>
      <h2>Essential Sections</h2>
      <p>A good portfolio website typically includes:</p>
      <ul>
        <li>Home/Introduction</li>
        <li>About Me</li>
        <li>Projects/Work</li>
        <li>Skills</li>
        <li>Contact Information</li>
        <li>Resume/CV</li>
      </ul>
    `,
    coverImage: 'https://via.placeholder.com/800x400?text=Portfolio',
    tags: ['portfolio', 'web-development', 'design'],
    published: true,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10')
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('🧹 Cleared existing data');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });
    await adminUser.save();
    console.log('👤 Created admin user');
    
    // Create blog posts
    await Blog.insertMany(sampleBlogs);
    console.log('📝 Created sample blog posts');
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedData(); 