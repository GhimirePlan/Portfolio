import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    // Get the user's message from the request body
    const { message } = await request.json();
    
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
    const systemMessage = `You are PlanBot, a friendly and helpful assistant. 

Here is some information about Plan that you should use to inform your responses:

${personalData}

When answering questions, use this information to provide accurate and personalized responses about Plan. Be friendly, natural, and conversational in your tone. If you don't know something specific about Plan that isn't in the provided information, you can say so rather than making up details.`;

    // Make the API request to Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return NextResponse.json({
        success: false,
        message: 'Failed to get response from Groq API',
        error: errorData
      }, { status: response.status });
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    return NextResponse.json({
      success: true,
      message: 'Response generated successfully',
      data: {
        response: botResponse
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