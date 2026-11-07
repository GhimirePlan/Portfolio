import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { bounded } from '@/lib/chat-recording';

export const dynamic = 'force-dynamic';
const json = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function GET(request) {
  if (!process.env.NEXTAUTH_SECRET) return json({ message: 'Admin authentication is not configured.' }, 503);
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'admin') return json({ message: 'Admin login required.' }, 403);
  if (!process.env.MONGODB_URI) return json({ message: 'Analytics storage is not configured.' }, 503);
  const days = Number(new URL(request.url).searchParams.get('days') || 30);
  if (![7, 30, 90].includes(days)) return json({ message: 'Choose a 7, 30, or 90 day period.' }, 400);
  try {
    return await bounded(async () => {
      await connectToDatabase();
      const start = new Date(); start.setUTCHours(0, 0, 0, 0); start.setUTCDate(start.getUTCDate() - days + 1);
      const [results, firstEvent] = await Promise.all([
        AnalyticsEvent.aggregate([
          { $match: { createdAt: { $gte: start } } },
          { $facet: {
            totals: [{ $group: { _id: null,
              pageViews: { $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] } },
              resumeClicks: { $sum: { $cond: [{ $eq: ['$type', 'resume_click'] }, 1, 0] } },
              projectOpens: { $sum: { $cond: [{ $eq: ['$type', 'project_open'] }, 1, 0] } },
              contactSubmissions: { $sum: { $cond: [{ $eq: ['$type', 'contact_submission'] }, 1, 0] } },
            } }],
            visitors: [{ $match: { type: 'page_view', visitorId: { $type: 'string' } } }, { $group: { _id: '$visitorId' } }, { $count: 'count' }],
            sessions: [{ $match: { type: 'page_view', sessionId: { $type: 'string' } } }, { $group: { _id: '$sessionId' } }, { $count: 'count' }],
            sources: [{ $match: { type: 'page_view' } }, { $group: { _id: '$sessionId', source: { $first: '$source' } } }, { $group: { _id: '$source', sessions: { $sum: 1 } } }, { $sort: { sessions: -1, _id: 1 } }, { $limit: 6 }],
            projects: [{ $match: { type: 'project_open' } }, { $group: { _id: '$resource', opens: { $sum: 1 } } }, { $sort: { opens: -1, _id: 1 } }, { $limit: 5 }],
            pages: [{ $match: { type: 'page_view' } }, { $group: { _id: '$path', views: { $sum: 1 } } }, { $sort: { views: -1, _id: 1 } }, { $limit: 5 }],
          } },
        ]).option({ maxTimeMS: 3000 }),
        AnalyticsEvent.findOne({}, { createdAt: 1 }).sort({ createdAt: 1 }).maxTimeMS(1000).lean(),
      ]);
      const result = results[0] || {};
      const totals = result.totals?.[0] || {};
      const sourceRows = (result.sources || []).map(item => ({ source: item._id || 'direct', sessions: item.sessions }));
      const otherSessions = (result.sessions?.[0]?.count || 0) - sourceRows.reduce((sum, item) => sum + item.sessions, 0);
      if (otherSessions > 0) sourceRows.push({ source: '__other__', sessions: otherSessions });
      return json({
        period: { days, start: start.toISOString(), end: new Date().toISOString() }, trackingSince: firstEvent?.createdAt || null,
        totals: { uniqueVisitors: result.visitors?.[0]?.count || 0, sessions: result.sessions?.[0]?.count || 0, pageViews: totals.pageViews || 0, resumeClicks: totals.resumeClicks || 0, projectOpens: totals.projectOpens || 0, contactSubmissions: totals.contactSubmissions || 0 },
        sources: sourceRows,
        projects: (result.projects || []).map(item => ({ url: item._id, name: item._id?.split('/').pop() || 'Project', opens: item.opens })),
        pages: (result.pages || []).map(item => ({ path: item._id || '/', views: item.views })), updatedAt: new Date().toISOString(),
      });
    }, 5500);
  } catch { return json({ message: 'Analytics could not be loaded. Please try again.' }, 503); }
}
