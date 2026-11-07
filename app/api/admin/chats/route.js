import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';
import { bounded } from '@/lib/chat-recording';

export const dynamic = 'force-dynamic';
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function GET(request) {
  if (!process.env.NEXTAUTH_SECRET) return json({ message: 'Admin authentication is not configured.' }, 503);
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') return json({ message: 'Admin login required.' }, 403);
  if (!process.env.MONGODB_URI) return json({ message: 'Chat storage is not configured.' }, 503);
  const params = new URL(request.url).searchParams;
  const sessionId = params.get('sessionId');
  if (sessionId && !/^[a-zA-Z0-9_-]{1,128}$/.test(sessionId)) return json({ message: 'Invalid session.' }, 400);
  try {
    return await bounded(async () => {
      await connectToDatabase();
      if (sessionId) {
        const chat = await ChatHistory.findOne({ sessionId }, { sessionId: 1, createdAt: 1, updatedAt: 1, messages: { $slice: -500 } }).maxTimeMS(2500).lean();
        return chat ? json({ chat }) : json({ message: 'Conversation not found.' }, 404);
      }
      const page = Math.max(1, Math.min(10000, Number.parseInt(params.get('page'), 10) || 1));
      const chats = await ChatHistory.find({}, { sessionId: 1, updatedAt: 1, createdAt: 1, messages: { $slice: -1 } }).sort({ updatedAt: -1 }).skip((page - 1) * 20).limit(21).maxTimeMS(2500).lean();
      return json({ chats: chats.slice(0, 20), hasMore: chats.length > 20, page });
    }, 5000);
  } catch { return json({ message: 'Chat history could not be loaded. Please retry.' }, 503); }
}
