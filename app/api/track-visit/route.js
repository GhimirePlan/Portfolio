import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Counter for total visits (this will reset on server restart)
let visitCounter = 0;

export async function POST(request) {
  try {
    // Increment visit counter
    visitCounter++;
    
    // Parse the request body
    const body = await request.json();
    let { ip, device, browser, timestamp, url } = body;
    
    // Get real IP from headers if available
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    
    // Use the most reliable IP source
    ip = forwardedFor?.split(',')[0] || realIp || ip || 'Unknown';
    
    // Get Discord webhook URL from environment variable
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (!webhookUrl) {
      // Visitor tracking is an optional integration. When it is not configured,
      // skip the webhook silently instead of returning an error to the client.
      return NextResponse.json({ success: true, skipped: true, count: visitCounter });
    }
    
    // Create Discord embed with direct link in description
    const embed = {
      title: "🚨 Footprints detected! 🐾",
      color: 5814783,
      fields: [
        { name: "🌐 IP Address", value: ip || "Unknown", inline: true },
        { name: "💻 Device", value: device || "Unknown", inline: true },
        { name: "🔍 Browser", value: browser || "Unknown", inline: true },
        { name: "⏰ Time", value: timestamp || new Date().toISOString(), inline: true },
        { name: "📊 Total Visits", value: visitCounter.toString(), inline: true },
        { name: "🔗 Page URL", value: url || "Unknown", inline: false }
      ],
      description: `**[View more](https://ipinfo.io/${ip})**`
    };
    
    // Send webhook to Discord with embed only (no components)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        embeds: [embed]
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord webhook failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to send webhook' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true, count: visitCounter });
    
  } catch (error) {
    console.error('Error processing visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}