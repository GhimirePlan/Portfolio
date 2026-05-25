import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import LinkedInPost from '@/models/LinkedInPost';

// GET /api/linkedin-posts - Get all LinkedIn posts
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');
    
    let query = {};
    if (featured !== null) {
      query.featured = featured === 'true';
    }
    if (tag && tag !== 'All') {
      query.tag = tag.toLowerCase();
    }
    
    const posts = await LinkedInPost.find(query).sort({ date: -1 });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn posts', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/linkedin-posts - Create a new LinkedIn post (Admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const body = await request.json();
    
    const newPost = new LinkedInPost({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newPost.save();
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating LinkedIn post:', error);
    return NextResponse.json(
      { error: 'Failed to create LinkedIn post', message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/linkedin-posts - Bulk update or other operations if needed
// For individual post updates, [id]/route.js is better
