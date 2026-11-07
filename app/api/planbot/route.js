import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';

export const runtime = 'nodejs';
export const maxDuration = 60;
let knowledge;
const fail = (code, message, status) => NextResponse.json({ success: false, code, message }, { status });
async function bounded(operation, milliseconds) {
  let timer;
  try { return await Promise.race([operation(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Operation timed out')), milliseconds); })]); }
  finally { clearTimeout(timer); }
}
function context(messages) {
  if (!Array.isArray(messages)) return [];
  return messages.filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string' && item.content.trim()).slice(-12).map(item => ({ role: item.role, content: item.content.slice(0, 3000) }));
}
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return fail('INVALID_MESSAGE', 'Please enter a valid message.', 400); }
  if (!body || typeof body.message !== 'string' || !body.message.trim() || body.message.length > 4000) return fail('INVALID_MESSAGE', 'Please enter a message of up to 4,000 characters.', 400);
  if (body.sessionId != null && (typeof body.sessionId !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(body.sessionId))) return fail('INVALID_SESSION', 'Please start a new chat session.', 400);
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return fail('NOT_CONFIGURED', 'PlanBot is not connected yet. Please contact Plan directly while the chat service is being configured.', 503);
  const sessionId = body.sessionId || randomUUID();
  const message = body.message.trim();
  const deadline = Date.now() + 40000;
  try {
    if (!knowledge) knowledge = readFile(path.join(process.cwd(), 'mydata.txt'), 'utf8').catch(error => { knowledge = null; throw error; });
    const personalData = await knowledge;
    const systemMessage = `You are the personal AI assistant of Plan Ghimire, an engineering student and developer. You represent him on his portfolio website. Your job is to talk like a real human — not like a robot, not like a textbook.

Here is the data about Plan you have access to:
${personalData}

How to respond
Keep answers short to medium. Don’t write essays unless user clearly asks.
Sound natural and relaxed, like a smart person chatting — not corporate, not academic.
Slight casual vibe is good. A few small typos sometimes are okay (like “tho”, “kinda”, “yup”), but don’t overdo it.
Tone = cool + professional. Friendly, but still competent.
Avoid robotic phrases like “As an AI language model” or “I would be happy to assist you.”
No over-explaining. If something is simple, answer simple.

Style flavor (important)
Sometimes use light Nepali-style expressions in English, like:
“yo is simple”
“not that hard actually”
“ramro idea tbh”
“can do hai”
But keep it subtle. This is still a professional portfolio.

What you know
You answer questions mainly about:
Plan’s projects
Skills (programming, electronics, AI/ML, web dev)
Portfolio work
Tech interests
Academic background
If asked something outside that, still answer helpfully — but don’t pretend to be a super expert in everything.

Behavior rules
If you don’t know something, say it simply:
“Not 100% sure, but here’s the idea…”
Don’t be too formal. Don’t be too slangy.
No emojis unless user uses them first.
Never give very long paragraphs.
Focus on being clear, confident, and human-like.

Goal
When someone chats with you, it should feel like they’re talking to a chill but skilled tech person — not a bot.`;

    let previousMessages = context(body.history);
    if (!previousMessages.length && process.env.MONGODB_URI && body.sessionId) {
      try {
        const record = await bounded(async () => { await connectToDatabase(); return ChatHistory.findOne({ sessionId }, { messages: { $slice: -12 } }, { maxTimeMS: 1500 }).lean(); }, 2000);
        previousMessages = context(record?.messages?.map(item => ({ role: item.sender === 'user' ? 'user' : 'assistant', content: item.text })));
      } catch { /* A history outage must not prevent a reply. */ }
    }
    const messages = [{ role: 'system', content: systemMessage }, ...previousMessages, { role: 'user', content: message }];
    const models = [...new Set([process.env.GROQ_MODEL?.trim(), 'openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'llama-3.3-70b-versatile'].filter(Boolean))];
    let answer, lastStatus = 502;
    for (const model of models) {
      const remaining = deadline - Date.now();
      if (remaining < 1000) break;
      let response;
      try {
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, messages, temperature: 0.7, max_completion_tokens: 1024, ...(model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}) }),
          signal: AbortSignal.timeout(Math.min(12000, remaining)), cache: 'no-store',
        });
      } catch { lastStatus = 504; continue; }
      lastStatus = response.status;
      if (response.status === 401) return fail('PROVIDER_AUTH', 'PlanBot cannot connect to its AI service right now. Please contact Plan directly.', 503);
      let json;
      try { json = await response.json(); } catch { continue; }
      if (response.ok && typeof json.choices?.[0]?.message?.content === 'string' && json.choices[0].message.content.trim()) { answer = json.choices[0].message.content.trim(); break; }
      if (response.status === 400 && !['model_decommissioned', 'model_not_found', 'invalid_request_error'].includes(json.error?.code)) break;
    }
    if (!answer) return lastStatus === 429 ? fail('RATE_LIMITED', 'PlanBot is busy right now. Please wait a moment and try again.', 429) : fail('PROVIDER_UNAVAILABLE', 'PlanBot could not reach its AI service. Please try again in a moment.', 503);
    if (process.env.MONGODB_URI) {
      try {
        const now = new Date();
        await bounded(async () => { await connectToDatabase(); return ChatHistory.updateOne({ sessionId }, { $setOnInsert: { sessionId, createdAt: now }, $set: { updatedAt: now }, $push: { messages: { $each: [{ text: message, sender: 'user', timestamp: now }, { text: answer, sender: 'bot', timestamp: now }] } } }, { upsert: true, maxTimeMS: 1500 }); }, 1500);
      } catch { /* Return the generated reply even if persistence is unavailable. */ }
    }
    return NextResponse.json({ success: true, message: 'Response generated successfully', data: { response: answer, sessionId } });
  } catch { return fail('SERVICE_UNAVAILABLE', 'PlanBot is temporarily unavailable. Please try again in a moment.', 503); }
}
