import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import connect from '@/lib/mongodb';
import Status from '@/models/DeveloperStatus';
import { bounded } from '@/lib/chat-recording';
const defaults = { availability: 'Open to Opportunities', discord: false, spotify: false };
export const dynamic = 'force-dynamic';
async function settings() { try { if (!process.env.MONGODB_URI) return defaults; return await bounded(async()=>{await connect();return await Status.findById('main').lean() || defaults;},1500); } catch { return defaults; } }
export async function GET(request) {
 if (new URL(request.url).searchParams.get('settings') === '1') {
  if (!process.env.NEXTAUTH_SECRET) return NextResponse.json({message:'Authentication unavailable'},{status:503});
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') return NextResponse.json({message:'Admin login required'},{status:403});
  const config = await settings();
  return NextResponse.json({availability:config.availability,discord:config.discord,spotify:config.spotify},{headers:{'Cache-Control':'private, no-store'}});
 }
 const config = await settings(); const result = { availability: config.availability, discord: config.discord, spotify: config.spotify, github: null, presence: null, listening: null };
 await Promise.allSettled([
 (async()=>{const user=process.env.GITHUB_USERNAME||'GhimirePlan';const r=await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/events/public`,{headers:{Accept:'application/vnd.github+json',...(process.env.GITHUB_TOKEN?{Authorization:`Bearer ${process.env.GITHUB_TOKEN}`}:{})},next:{revalidate:300},signal:AbortSignal.timeout(3000)});if(!r.ok)return;const events=await r.json();const event=Array.isArray(events)&&events.find(e=>e.type==='PushEvent');if(event)result.github={repository:event.repo.name,url:`https://github.com/${event.repo.name}`,at:event.created_at};})(),
 (async()=>{if(!config.discord||!/^\d{17,20}$/.test(process.env.DISCORD_USER_ID||''))return;const r=await fetch(`https://api.lanyard.rest/v1/users/${process.env.DISCORD_USER_ID}`,{next:{revalidate:60},signal:AbortSignal.timeout(2500)});const d=await r.json();if(r.ok&&d.success)result.presence=d.data.discord_status;})(),
 (async()=>{if(!config.spotify||!process.env.SPOTIFY_REFRESH_TOKEN||!process.env.SPOTIFY_CLIENT_ID||!process.env.SPOTIFY_CLIENT_SECRET)return;const token=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',refresh_token:process.env.SPOTIFY_REFRESH_TOKEN}),signal:AbortSignal.timeout(2500),cache:'no-store'});if(!token.ok)return;const t=await token.json();const r=await fetch('https://api.spotify.com/v1/me/player/currently-playing',{headers:{Authorization:`Bearer ${t.access_token}`},signal:AbortSignal.timeout(2500),cache:'no-store'});if(r.status!==200)return;const d=await r.json();if(d.is_playing&&d.item)result.listening={name:d.item.name,artist:d.item.artists?.map(a=>a.name).join(', ')};})()
 ]);return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}});
}
export async function PUT(request) {
 if(!process.env.NEXTAUTH_SECRET)return NextResponse.json({message:'Authentication unavailable'},{status:503});
 const session=await getServerSession(authOptions);if(session?.user?.role!=='admin')return NextResponse.json({message:'Admin login required'},{status:403});
 let body;try{body=await request.json();}catch{return NextResponse.json({message:'Invalid settings'},{status:400});}
 if(typeof body.availability!=='string'||!body.availability.trim()||body.availability.length>60||typeof body.discord!=='boolean'||typeof body.spotify!=='boolean')return NextResponse.json({message:'Invalid settings'},{status:400});
 try{await bounded(async()=>{await connect();await Status.updateOne({_id:'main'},{$set:{availability:body.availability.trim(),discord:body.discord,spotify:body.spotify}},{upsert:true,maxTimeMS:1500});},2500);return NextResponse.json({success:true});}catch{return NextResponse.json({message:'Settings could not be saved'},{status:503});}
}
