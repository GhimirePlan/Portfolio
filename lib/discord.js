// Server-only: never expose the webhook URL or log its token.
export async function sendDiscordEmbed(embed) {
  const webhook = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhook) return false;
  try {
    const url = new URL(webhook);
    if (url.protocol !== 'https:' || !['discord.com', 'discordapp.com'].includes(url.hostname) || !url.pathname.startsWith('/api/webhooks/')) return false;
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowed_mentions: { parse: [] }, embeds: [embed] }),
      signal: AbortSignal.timeout(3000), cache: 'no-store',
    });
    if (!response.ok) console.warn('Discord notification failed', { status: response.status });
    return response.ok;
  } catch { console.warn('Discord notification unavailable'); return false; }
}

export function chatHistoryUrl(sessionId) {
  // Use the canonical domain, never the visitor-supplied Host header.
  let origin = 'https://www.plan.com.np';
  try { const url = new URL(process.env.NEXT_PUBLIC_APP_URL); if (['http:', 'https:'].includes(url.protocol)) origin = url.origin; } catch {}
  return `${origin}/admin/chats/${encodeURIComponent(sessionId)}`;
}
