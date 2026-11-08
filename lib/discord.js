function compactEmbed(embed) {
  let remaining=5600;
  const cut=(value,max)=>{const out=String(value||'').slice(0,Math.min(max,remaining));remaining-=out.length;return out};
  const result={...embed,title:cut(embed.title,256),description:cut(embed.description,3000)};
  result.fields=(embed.fields||[]).slice(0,25).map(field=>({name:cut(field.name,256),value:cut(field.value,1024),inline:Boolean(field.inline)})).filter(field=>field.name&&field.value);
  const footer=cut(embed.footer?.text||'Portfolio · Live notifications · Admin links require sign-in',200);
  if(footer)result.footer={text:footer};else delete result.footer;
  if(!result.timestamp)result.timestamp=new Date().toISOString();
  return result;
}
// Server-only: never expose the webhook URL or log its token.
export async function sendDiscordEmbed(embed) {
  const webhook = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhook) return false;
  try {
    const url = new URL(webhook);
    if (url.protocol !== 'https:' || !['discord.com', 'discordapp.com'].includes(url.hostname) || !url.pathname.startsWith('/api/webhooks/')) return false;
    const options = {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowed_mentions: { parse: [] }, embeds: [compactEmbed(embed)] }),
      signal: AbortSignal.timeout(3000), cache: 'no-store',
    };
    let response=await fetch(url,options);
    if(response.status===429){const wait=Number((await response.json().catch(()=>({}))).retry_after);if(Number.isFinite(wait)&&wait>=0&&wait<=1){await new Promise(resolve=>setTimeout(resolve,Math.ceil(wait*1000)));response=await fetch(url,{...options,signal:AbortSignal.timeout(2000)})}}
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
