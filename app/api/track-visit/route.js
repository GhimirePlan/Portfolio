import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { sendDiscordEmbed } from '@/lib/discord';

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
    
    const field = value => String(value || 'Unknown').slice(0, 1024);
    // Create Discord embed with direct link in description
    const embed = {
      title: "🚨 Footprints detected! 🐾",
      color: 5814783,
      fields: [
        { name: "🌐 IP Address", value: field(ip), inline: true },
        { name: "💻 Device", value: field(device), inline: true },
        { name: "🔍 Browser", value: field(browser), inline: true },
        { name: "⏰ Time", value: new Date().toISOString(), inline: true },
        { name: "📊 Total Visits", value: visitCounter.toString(), inline: true },
        { name: "🔗 Page URL", value: field(url), inline: false }
      ],
      description: `**[View more](https://ipinfo.io/${encodeURIComponent(ip)})**`
    };
    
    // Send webhook to Discord with embed only (no components)
    const delivered = await sendDiscordEmbed(embed);
    if (!delivered) return NextResponse.json({ success: false, message: 'Visit notification could not be sent.' }, { status: 502 });

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