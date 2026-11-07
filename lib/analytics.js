import { randomUUID } from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { bounded } from '@/lib/chat-recording';

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function projectResource(value) {
  try {
    const url = new URL(value);
    const [owner, repo] = url.pathname.split('/').filter(Boolean);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || owner?.toLowerCase() !== (process.env.GITHUB_USERNAME || 'GhimirePlan').toLowerCase() || !/^[a-z0-9_.-]{1,100}$/i.test(repo || '')) return null;
    return `https://github.com/${owner.toLowerCase()}/${repo.toLowerCase().replace(/\.git$/, '')}`;
  } catch { return null; }
}
export function publicAnalyticsEvent(body) {
  if (!body || !['page_view', 'project_open', 'resume_click'].includes(body.type) || !uuidPattern.test(body.id || '') || !uuidPattern.test(body.visitorId || '') || !uuidPattern.test(body.sessionId || '')) return null;
  if (typeof body.path !== 'string' || !body.path.startsWith('/') || body.path.startsWith('//') || body.path.length > 1024) return null;
  let path;
  try { path = new URL(body.path, 'https://www.plan.com.np').pathname; if (/^\/(admin|api|_next|visitor-test)(\/|$)/i.test(decodeURIComponent(path))) return null; } catch { return null; }
  if (path.length > 256) return null;
  const rawSource = typeof body.source === 'string' && /^[a-z0-9][a-z0-9_.-]{0,99}$/i.test(body.source) ? body.source.toLowerCase() : 'direct';
  const aliases = { 'google.com': 'google', 'linkedin.com': 'linkedin', 'l.linkedin.com': 'linkedin', 'lnkd.in': 'linkedin', 'github.com': 'github', 'facebook.com': 'facebook', 'm.facebook.com': 'facebook', 't.co': 'x', 'twitter.com': 'x', 'x.com': 'x' };
  const source = Object.prototype.hasOwnProperty.call(aliases, rawSource) ? aliases[rawSource] : (/^google\.[a-z.]+$/.test(rawSource) ? 'google' : rawSource);
  const resource = body.type.startsWith('project_') ? projectResource(body.resource) : undefined;
  if (body.type.startsWith('project_') && !resource) return null;
  return { _id: body.id, type: body.type, visitorId: body.visitorId, sessionId: body.sessionId, path, source, ...(resource ? { resource } : {}) };
}
export async function recordAnalytics(event) {
  if (!process.env.MONGODB_URI) return false;
  try {
    await bounded(async () => {
      await connectToDatabase();
      await AnalyticsEvent.updateOne({ _id: event._id || randomUUID() }, { $setOnInsert: { ...event, createdAt: new Date() } }, { upsert: true, maxTimeMS: 1000 });
    }, 1500);
    return true;
  } catch { return false; } // Metrics must never prevent contact delivery or navigation.
}
