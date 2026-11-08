import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import connect from '@/lib/mongodb';
import Submission from '@/models/ContactSubmission';
import { bounded } from '@/lib/chat-recording';
export const dynamic='force-dynamic';
const json=(body,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(request){
 if(!process.env.NEXTAUTH_SECRET)return json({message:'Authentication unavailable'},503);
 const session=await getServerSession(authOptions);if(session?.user?.role!=='admin')return json({message:'Admin login required'},403);
 const params=new URL(request.url).searchParams,id=params.get('id');if(id&&!/^[a-f0-9]{24}$/i.test(id))return json({message:'Invalid submission'},400);
 const page=Math.max(1,Math.min(10000,parseInt(params.get('page'),10)||1));
 try{return await bounded(async()=>{await connect();if(id){const submission=await Submission.findById(id).maxTimeMS(2000).lean();return submission?json({submission}):json({message:'Submission not found'},404)}const rows=await Submission.find({}, {name:1,email:1,createdAt:1,emailStatus:1,discordSent:1}).sort({createdAt:-1}).skip((page-1)*20).limit(21).maxTimeMS(2000).lean();return json({submissions:rows.slice(0,20),hasMore:rows.length>20})},5000)}catch{return json({message:'Inbox could not be loaded. Please retry.'},503)}
}
