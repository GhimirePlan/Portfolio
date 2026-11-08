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
 (async()=>{
   const id=process.env.DISCORD_USER_ID?.trim();
   if((!config.discord&&!config.spotify)||!/^\d{17,20}$/.test(id||''))return;
   const r=await fetch(`https://api.lanyard.rest/v1/users/${id}`,{cache:'no-store',signal:AbortSignal.timeout(2500)});
   if(!r.ok)return;
   const response=await r.json();const data=response?.success&&response.data;
   if(!data)return;
   if(config.discord&&['online','idle','dnd','offline'].includes(data.discord_status))result.presence=data.discord_status;
   const song=data.spotify;
   if(config.spotify&&data.listening_to_spotify===true&&song&&typeof song.song==='string'&&typeof song.artist==='string'&&/^[a-zA-Z0-9]{22}$/.test(song.track_id||'')){
     let artwork=null;
     try{const url=new URL(song.album_art_url);if(url.protocol==='https:'&&['i.scdn.co','mosaic.scdn.co'].includes(url.hostname))artwork=url.href;}catch{}
     result.listening={name:song.song,artist:song.artist,artwork,url:`https://open.spotify.com/track/${song.track_id}`};
   }
 })()
 ]);return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}});
}
export async function PUT(request) {
 if(!process.env.NEXTAUTH_SECRET)return NextResponse.json({message:'Authentication unavailable'},{status:503});
 const session=await getServerSession(authOptions);if(session?.user?.role!=='admin')return NextResponse.json({message:'Admin login required'},{status:403});
 let body;try{body=await request.json();}catch{return NextResponse.json({message:'Invalid settings'},{status:400});}
 if(typeof body.availability!=='string'||!body.availability.trim()||body.availability.length>60||typeof body.discord!=='boolean'||typeof body.spotify!=='boolean')return NextResponse.json({message:'Invalid settings'},{status:400});
 try{await bounded(async()=>{await connect();await Status.updateOne({_id:'main'},{$set:{availability:body.availability.trim(),discord:body.discord,spotify:body.spotify}},{upsert:true,maxTimeMS:1500});},2500);return NextResponse.json({success:true});}catch{return NextResponse.json({message:'Settings could not be saved'},{status:503});}
}
