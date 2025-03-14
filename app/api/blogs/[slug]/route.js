import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET /api/blogs/[slug] - Get a single blog post
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // Connect to the database
    await connectToDatabase();
    
    // Find the blog post by slug
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[slug] - Update a blog post
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const { slug } = params;
    const body = await request.json();
    
    // Connect to the database
    await connectToDatabase();
    
    // Find the blog post by slug
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Update the blog post
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[slug] - Delete a blog post
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const { slug } = params;
    
    // Connect to the database
    await connectToDatabase();
    
    // Find and delete the blog post
    const result = await Blog.findOneAndDelete({ slug });
    
    if (!result) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 