import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

// GET handler to fetch a specific comment
export async function GET(request, { params }) {
  const { id } = params;
  
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }
  
  try {
    await connectToDatabase();
    
    const comment = await Comment.findById(id);
    
    if (!comment || comment.isDeleted) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json({ error: 'Failed to fetch comment' }, { status: 500 });
  }
}

// PATCH handler to update a comment
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  
  const { id } = params;
  
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }
  
  try {
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find the comment
    const comment = await Comment.findById(id);
    
    if (!comment || comment.isDeleted) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    // Check if the user is the author of the comment
    if (comment.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Not authorized to update this comment' }, { status: 403 });
    }
    
    // Update the comment
    comment.content = content;
    await comment.save();
    
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// DELETE handler to soft delete a comment
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  
  const { id } = params;
  
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }
  
  try {
    await connectToDatabase();
    
    // Find the comment
    const comment = await Comment.findById(id);
    
    if (!comment || comment.isDeleted) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    // Check if the user is the author of the comment
    if (comment.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Not authorized to delete this comment' }, { status: 403 });
    }
    
    // Soft delete the comment
    comment.isDeleted = true;
    await comment.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
} 