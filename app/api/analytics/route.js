import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { publicAnalyticsEvent, recordAnalytics } from '@/lib/analytics';

export const runtime = 'nodejs';
const respond = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return respond({ success: false }, 403);
  if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1' || /bot\b|crawler|spider/i.test(request.headers.get('user-agent') || '')) return respond({ success: true, skipped: true });
  if (process.env.NEXTAUTH_SECRET) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.role === 'admin') return respond({ success: true, skipped: true });
  }
  let body;
  try { const text = await request.text(); if (text.length > 4096) return respond({ success: false }, 413); body = JSON.parse(text); } catch { return respond({ success: false }, 400); }
  const event = publicAnalyticsEvent(body);
  if (!event) return respond({ success: false }, 400);
  const saved = await recordAnalytics(event);
  return respond({ success: saved }, saved ? 200 : 503);
}
