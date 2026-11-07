import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import ChatHistory from '@/models/ChatHistory';
import LinkedInPost from '@/models/LinkedInPost';
import { bounded } from '@/lib/chat-recording';
import { contactConfig } from '@/lib/contact-config';

export const dynamic = 'force-dynamic';
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function GET() {
  if (!process.env.NEXTAUTH_SECRET) return json({ message: 'Admin authentication is not configured.' }, 503);
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') return json({ message: 'Admin login required.' }, 403);
  if (!process.env.MONGODB_URI) return json({ message: 'Connect your database to load the workspace overview.' }, 503);
  try {
    return await bounded(async () => {
      await connectToDatabase();
      const start = new Date(); start.setUTCHours(0, 0, 0, 0); start.setUTCDate(start.getUTCDate() - 6);
      const [totalPosts, publishedPosts, conversations, linkedInPosts, posts, chats, activity] = await Promise.all([
        Blog.countDocuments({}).maxTimeMS(2500), Blog.countDocuments({ published: true }).maxTimeMS(2500),
        ChatHistory.countDocuments({}).maxTimeMS(2500), LinkedInPost.countDocuments({}).maxTimeMS(2500),
        Blog.find({}, { title: 1, slug: 1, published: 1, updatedAt: 1 }).sort({ updatedAt: -1 }).limit(4).maxTimeMS(2500).lean(),
        ChatHistory.find({}, { sessionId: 1, updatedAt: 1, messages: { $slice: -1 } }).sort({ updatedAt: -1 }).limit(4).maxTimeMS(2500).lean(),
        ChatHistory.aggregate([{ $match: { createdAt: { $gte: start } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } }, count: { $sum: 1 } } }]).option({ maxTimeMS: 2500 }),
      ]);
      const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(start); date.setUTCDate(date.getUTCDate() + index); const key = date.toISOString().slice(0, 10); return { date: key, count: activity.find(day => day._id === key)?.count || 0 }; });
      return json({ stats: { totalPosts, publishedPosts, draftPosts: totalPosts - publishedPosts, conversations, linkedInPosts }, posts, chats, activity: days,
        services: { planbot: Boolean(process.env.GROQ_API_KEY?.trim()), discord: Boolean(process.env.DISCORD_WEBHOOK_URL?.trim()), contact: contactConfig().ready }, updatedAt: new Date().toISOString() });
    }, 6000);
  } catch { return json({ message: 'The overview could not be loaded. Please try refreshing.' }, 503); }
}
