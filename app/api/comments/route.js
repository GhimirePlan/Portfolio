import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

// GET handler to fetch comments for a blog post
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const blogSlug = searchParams.get('blogSlug');
  
  if (!blogSlug) {
    return NextResponse.json({ error: 'Blog slug is required' }, { status: 400 });
  }
  
  try {
    await connectToDatabase();
    
    // Find the blog post by slug
    const blog = await Blog.findOne({ slug: blogSlug });
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    // Fetch top-level comments for the blog post
    const topLevelComments = await Comment.find({ 
      blogId: blog._id,
      parentId: null,
      isDeleted: false
    }).sort({ createdAt: -1 });
    
    // Fetch all replies for these comments
    const commentIds = topLevelComments.map(comment => comment._id);
    const replies = await Comment.find({
      parentId: { $in: commentIds },
      isDeleted: false
    }).sort({ createdAt: 1 });
    
    // Group replies by parent comment
    const repliesByParent = {};
    replies.forEach(reply => {
      const parentId = reply.parentId.toString();
      if (!repliesByParent[parentId]) {
        repliesByParent[parentId] = [];
      }
      repliesByParent[parentId].push(reply);
    });
    
    // Attach replies to their parent comments
    const commentsWithReplies = topLevelComments.map(comment => {
      const commentObj = comment.toObject({ virtuals: true });
      commentObj.replies = repliesByParent[comment._id.toString()] || [];
      return commentObj;
    });
    
    return NextResponse.json({ comments: commentsWithReplies });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST handler to create a new comment
export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { blogSlug, content, parentId } = body;
    
    if (!blogSlug || !content) {
      return NextResponse.json({ error: 'Blog slug and content are required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find the blog post by slug
    const blog = await Blog.findOne({ slug: blogSlug });
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    let level = 0;
    
    // If this is a reply, get the parent comment and increment its reply count
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      
      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
      
      // Increment the parent comment's reply count
      await Comment.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } });
      
      // Set the level for this reply (parent level + 1, max 3)
      level = Math.min(parentComment.level + 1, 3);
    }
    
    // Create the comment
    const comment = new Comment({
      blogId: blog._id,
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      },
      content,
      parentId: parentId || null,
      level
    });
    
    await comment.save();
    
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
} 