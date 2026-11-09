import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';
import { loadPortfolioContent } from '@/lib/planbot-content';
import { buildPlanBotPrompt } from '@/lib/planbot-prompt';
import { bounded, recordChatStart } from '@/lib/chat-recording';

export const runtime = 'nodejs';
export const maxDuration = 60;
let knowledge;
const fail = (code, message, status) => NextResponse.json({ success: false, code, message }, { status });
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
  const sessionId = body.sessionId || randomUUID();
  const message = body.message.trim();
  if (!apiKey) { await recordChatStart(sessionId, message); return fail('NOT_CONFIGURED', 'PlanBot is not connected yet. Please contact Plan directly while the chat service is being configured.', 503); }
  const deadline = Date.now() + 40000;
  let recording;
  try {
    if (!knowledge) knowledge = readFile(path.join(process.cwd(), 'mydata.txt'), 'utf8').catch(error => { knowledge = null; throw error; });
    const [personalData, liveContent] = await Promise.all([knowledge, loadPortfolioContent([message, ...context(body.history).filter(item=>item.role==='user').slice(-2).map(item=>item.content)].join(' '))]);
    const systemMessage = buildPlanBotPrompt(personalData, liveContent);

    let previousMessages = context(body.history);
    if (!previousMessages.length && process.env.MONGODB_URI && body.sessionId) {
      try {
        const record = await bounded(async () => { await connectToDatabase(); return ChatHistory.findOne({ sessionId }, { messages: { $slice: -12 } }, { maxTimeMS: 1500 }).lean(); }, 2000);
        previousMessages = context(record?.messages?.map(item => ({ role: item.sender === 'user' ? 'user' : 'assistant', content: item.text })));
      } catch { /* A history outage must not prevent a reply. */ }
    }
    recording = recordChatStart(sessionId, message);
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
          body: JSON.stringify({ model, messages, temperature: 0.35, max_completion_tokens: 1024, ...(model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}) }),
          signal: AbortSignal.timeout(Math.min(12000, remaining)), cache: 'no-store',
        });
      } catch { lastStatus = 504; continue; }
      lastStatus = response.status;
      if (response.status === 401) { await recording; return fail('PROVIDER_AUTH', 'PlanBot cannot connect to its AI service right now. Please contact Plan directly.', 503); }
      let json;
      try { json = await response.json(); } catch { continue; }
      if (response.ok && typeof json.choices?.[0]?.message?.content === 'string' && json.choices[0].message.content.trim()) { answer = json.choices[0].message.content.trim(); break; }
      if (response.status === 400 && !['model_decommissioned', 'model_not_found', 'invalid_request_error'].includes(json.error?.code)) break;
    }
    await recording;
    if (!answer) return lastStatus === 429 ? fail('RATE_LIMITED', 'PlanBot is busy right now. Please wait a moment and try again.', 429) : fail('PROVIDER_UNAVAILABLE', 'PlanBot could not reach its AI service. Please try again in a moment.', 503);
    if (process.env.MONGODB_URI) {
      try {
        const now = new Date();
        await bounded(async () => { await connectToDatabase(); return ChatHistory.updateOne({ sessionId }, { $setOnInsert: { sessionId, createdAt: now }, $set: { updatedAt: now }, $push: { messages: { text: answer, sender: 'bot', timestamp: now } } }, { upsert: true, maxTimeMS: 1500 }); }, 1500);
      } catch { /* Return the generated reply even if persistence is unavailable. */ }
    }
    return NextResponse.json({ success: true, message: 'Response generated successfully', data: { response: answer, sessionId, sources: liveContent.blogs.articles.map(article=>({title:article.title,url:article.url})), grounding: { blogsAvailable:liveContent.blogs.available, blogCount:liveContent.blogs.catalog.length, githubAvailable:liveContent.github.available } } });
  } catch { await recording; return fail('SERVICE_UNAVAILABLE', 'PlanBot is temporarily unavailable. Please try again in a moment.', 503); }
}
