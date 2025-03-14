import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET /api/blogs - Get all blogs
export async function GET(request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build the query
    let query = {};
    
    // If published parameter is provided, filter by it
    if (published !== null) {
      const isPublished = published === 'true';
      query.published = isPublished;
    }
    
    // Count total documents matching the query
    const total = await Blog.countDocuments(query);
    
    // Get paginated blogs
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 }) // Sort by createdAt (newest first)
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    const body = await request.json();
    
    // Generate a slug from the title if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    // Check if a blog with the same slug already exists
    const existingBlog = await Blog.findOne({ slug: body.slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Create a new blog post
    const newBlog = new Blog({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Save the blog post
    await newBlog.save();
    
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create blog' },
      { status: 500 }
    );
  }
} 