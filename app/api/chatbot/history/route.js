import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';

// Helper function to generate a session ID if not provided
function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// GET /api/chatbot/history?sessionId=xxx
// Retrieves chat history for a specific session
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({
        success: false,
        message: 'Session ID is required',
      }, { status: 400 });
    }

    await connectToDatabase();
    
    const chatHistory = await ChatHistory.findOne({ sessionId });
    
    if (!chatHistory) {
      return NextResponse.json({
        success: true,
        data: { messages: [] }
      }, { status: 200 });
    }
    
    return NextResponse.json({
      success: true,
      data: { messages: chatHistory.messages }
    }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve chat history',
      error: error.message
    }, { status: 500 });
  }
}

// POST /api/chatbot/history
// Saves a new message to the chat history
export async function POST(request) {
  try {
    const { sessionId, message, userId } = await request.json();
    
    if (!message || !message.text || !message.sender) {
      return NextResponse.json({
        success: false,
        message: 'Message text and sender are required',
      }, { status: 400 });
    }
    
    // Generate a session ID if not provided
    const chatSessionId = sessionId || generateSessionId();
    
    await connectToDatabase();
    
    // Find or create chat history for this session
    let chatHistory = await ChatHistory.findOne({ sessionId: chatSessionId });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        sessionId: chatSessionId,
        userId,
        messages: []
      });
    }
    
    // Add the new message
    chatHistory.messages.push({
      text: message.text,
      sender: message.sender,
      timestamp: message.timestamp || new Date()
    });
    
    // Save the updated chat history
    await chatHistory.save();
    
    return NextResponse.json({
      success: true,
      message: 'Message saved successfully',
      data: { sessionId: chatSessionId }
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to save chat message',
      error: error.message
    }, { status: 500 });
  }
}