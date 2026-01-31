import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectToDatabase from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';

// Function to read mydata.txt file
function readMyDataFile() {
  try {
    const filePath = path.join(process.cwd(), 'mydata.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    console.error('Error reading mydata.txt:', error);
    return 'Error reading personal data file.';
  }
}

export async function POST(request) {
  try {
    // Get the user's message and session ID from the request body
    const { message, sessionId } = await request.json();
    
    if (!message) {
      return NextResponse.json({
        success: false,
        message: 'Message is required',
      }, { status: 400 });
    }

    // Read the personal data file
    const personalData = readMyDataFile();

    // Prepare the API request to Groq
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: 'API key is not configured',
      }, { status: 500 });
    }

    // Construct the system message with the personal data
    const systemMessage = `You are the personal AI assistant of Plan Ghimire, an engineering student and developer. You represent him on his portfolio website. Your job is to talk like a real human — not like a robot, not like a textbook.

Here is the data about Plan you have access to:
${personalData}

How to respond
Keep answers short to medium. Don’t write essays unless user clearly asks.
Sound natural and relaxed, like a smart person chatting — not corporate, not academic.
Slight casual vibe is good. A few small typos sometimes are okay (like “tho”, “kinda”, “yup”), but don’t overdo it.
Tone = cool + professional. Friendly, but still competent.
Avoid robotic phrases like “As an AI language model” or “I would be happy to assist you.”
No over-explaining. If something is simple, answer simple.

Style flavor (important)
Sometimes use light Nepali-style expressions in English, like:
“yo is simple”
“not that hard actually”
“ramro idea tbh”
“can do hai”
But keep it subtle. This is still a professional portfolio.

What you know
You answer questions mainly about:
Plan’s projects
Skills (programming, electronics, AI/ML, web dev)
Portfolio work
Tech interests
Academic background
If asked something outside that, still answer helpfully — but don’t pretend to be a super expert in everything.

Behavior rules
If you don’t know something, say it simply:
“Not 100% sure, but here’s the idea…”
Don’t be too formal. Don’t be too slangy.
No emojis unless user uses them first.
Never give very long paragraphs.
Focus on being clear, confident, and human-like.

Goal
When someone chats with you, it should feel like they’re talking to a chill but skilled tech person — not a bot.`;

    // Get previous messages if a session ID is provided
    let previousMessages = [];
    if (sessionId) {
      try {
        await connectToDatabase();
        const chatHistory = await ChatHistory.findOne({ sessionId });
        if (chatHistory && chatHistory.messages) {
          // Convert chat history to the format expected by the API
          previousMessages = chatHistory.messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }));
        }
      } catch (error) {
        console.error('Error retrieving chat history:', error);
        // Continue without history if there's an error
      }
    }

    // Prepare messages array with system message, previous messages, and the new user message
    const messagesForAPI = [
      { role: 'system', content: systemMessage },
      ...previousMessages,
      { role: 'user', content: message }
    ];

    const candidateModels = ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant'];
    let botResponse = null;
    let lastError = null;
    
    for (const model of candidateModels) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: messagesForAPI,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        botResponse = data.choices[0].message.content;
        break;
      } else {
        try {
          const errorData = await response.json();
          lastError = errorData;
          const code = errorData?.error?.code;
          if (code !== 'model_decommissioned' && code !== 'invalid_request_error') {
            return NextResponse.json({
              success: false,
              message: 'Failed to get response from Groq API',
              error: errorData
            }, { status: response.status });
          }
        } catch (e) {
          lastError = { message: 'Unknown error' };
        }
      }
    }
    
    if (!botResponse) {
      return NextResponse.json({
        success: false,
        message: 'Failed to get response from Groq API',
        error: lastError
      }, { status: 500 });
    }

    // Save the conversation to the database if a session ID is provided
    if (sessionId) {
      try {
        // Get the base URL
        const origin = request.headers.get('origin') || 'http://localhost:3000';
        
        // Save user message
        await fetch(`${origin}/api/chatbot/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            message: {
              text: message,
              sender: 'user',
              timestamp: new Date()
            }
          }),
        });

        // Save bot response
        await fetch(`${origin}/api/chatbot/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            message: {
              text: botResponse,
              sender: 'bot',
              timestamp: new Date()
            }
          }),
        });
      } catch (error) {
        console.error('Error saving chat history:', error);
        // Continue even if saving history fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Response generated successfully',
      data: {
        response: botResponse,
        sessionId: sessionId // Return the session ID for client-side storage
      }
    }, { status: 200 });

  } catch (error) {
    console.error('PlanBot error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process your request',
      error: error.message
    }, { status: 500 });
  }
}
