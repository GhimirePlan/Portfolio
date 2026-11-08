import { NextResponse } from 'next/server';
import { sendDiscordEmbed } from '@/lib/discord';
import { visitorAlert } from '@/lib/visitor-alert';
export async function POST(request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({success:false},{status:403});
 let body;try{const raw=await request.text();if(raw.length>8192)return NextResponse.json({success:false},{status:413});body=JSON.parse(raw);if(!body||typeof body!=='object'||Array.isArray(body))throw Error();}catch{return NextResponse.json({success:false},{status:400})}
 if(!process.env.DISCORD_WEBHOOK_URL)return NextResponse.json({success:true,skipped:true});
 const sent=await sendDiscordEmbed(visitorAlert(body,request.headers));return NextResponse.json({success:sent},{status:sent?200:502});
}
