// Lightweight first-party measurement. No names, emails, IPs, or full referrer URLs.
let memoryVisitor, memorySession;
const visitorKey = 'portfolio.analytics.visitor';
const sessionKey = 'portfolio.analytics.session';
function id() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = bytes[6] & 15 | 64; bytes[8] = bytes[8] & 63 | 128;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
function source() {
  const campaign = new URLSearchParams(location.search).get('utm_source');
  if (/^[a-z0-9][a-z0-9_-]{0,39}$/i.test(campaign || '')) return campaign.toLowerCase();
  try { const referrer = new URL(document.referrer); if (referrer.hostname !== location.hostname && !['plan.com.np', 'www.plan.com.np'].includes(referrer.hostname)) return referrer.hostname.toLowerCase().replace(/^www\./, ''); } catch {}
  return 'direct';
}
export function analyticsIdentity() {
  if (typeof window === 'undefined' || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return null;
  try {
    let visitorId;
    try { visitorId = localStorage.getItem(visitorKey); } catch {}
    if (!/^[0-9a-f-]{36}$/i.test(visitorId || '')) { visitorId = memoryVisitor || id(); try { localStorage.setItem(visitorKey, visitorId); } catch {} }
    memoryVisitor = visitorId;
    let session;
    try { session = JSON.parse(sessionStorage.getItem(sessionKey)); } catch {}
    session = session || memorySession;
    if (!session || Date.now() - session.lastSeen > 30 * 60 * 1000 || !session.id) session = { id: id(), source: source() };
    session.lastSeen = Date.now(); memorySession = session;
    try { sessionStorage.setItem(sessionKey, JSON.stringify(session)); } catch {}
    return { visitorId, sessionId: session.id, source: session.source };
  } catch { return null; }
}
export function trackAnalytics(type, details = {}) {
  const identity = analyticsIdentity();
  if (!identity || location.pathname.startsWith('/admin')) return;
  try {
    const body = JSON.stringify({ ...identity, id: id(), type, path: location.pathname, ...details });
    // Keep navigation immediate; keepalive lets a click finish after the page closes.
    fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true, credentials: 'same-origin' }).catch(() => {});
  } catch {}
}
export function projectLink(value) {
  try {
    const url = new URL(value, location.origin);
    const parts = url.pathname.split('/').filter(Boolean);
    if (url.protocol === 'https:' && url.hostname === 'github.com' && parts[0]?.toLowerCase() === 'ghimireplan' && /^[a-z0-9_.-]+$/i.test(parts[1] || '')) return `https://github.com/${parts[0]}/${parts[1]}`;
  } catch {}
  return null;
}
