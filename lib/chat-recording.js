import connectToDatabase from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';
import { sendDiscordEmbed, chatHistoryUrl } from '@/lib/discord';

export async function bounded(operation, milliseconds) {
  let timer;
  try { return await Promise.race([operation(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Operation timed out')), milliseconds); })]); }
  finally { clearTimeout(timer); }
}

// Record the first message even when the AI provider cannot produce a reply.
export async function recordChatStart(sessionId, message) {
  if (!process.env.MONGODB_URI) return false;
  try {
    const now = new Date();
    await bounded(async () => {
      await connectToDatabase();
      await ChatHistory.updateOne({ sessionId }, {
        $setOnInsert: { sessionId, createdAt: now }, $set: { updatedAt: now },
        $push: { messages: { text: message, sender: 'user', timestamp: now } },
      }, { upsert: true, maxTimeMS: 1500 });
    }, 2500);
  } catch { console.warn('PlanBot message could not be saved'); return false; }
  if (!process.env.DISCORD_WEBHOOK_URL) return true;
  let claimed;
  try {
    // Atomic lease prevents duplicate alerts on simultaneous messages. Failed sends
    // release the lease; a later message retries. Crashed workers expire after 30s.
    claimed = await bounded(() => ChatHistory.findOneAndUpdate({
      sessionId, discordNotifiedAt: null,
      $or: [{ discordNotificationClaimedAt: null }, { discordNotificationClaimedAt: { $lt: new Date(Date.now() - 30000) } }],
    }, { $set: { discordNotificationClaimedAt: new Date() } }, { new: true, maxTimeMS: 1500 }).select('_id').lean(), 1800);
    if (!claimed) return true;
    const sent = await sendDiscordEmbed({
      title: '💬 A visitor started a PlanBot chat', url: chatHistoryUrl(sessionId),
      description: `[Read conversation](${chatHistoryUrl(sessionId)}) · Admin login required`,
      color: 1752220, timestamp: new Date().toISOString(),
      fields: [{ name: 'Session', value: sessionId }],
    });
    await bounded(() => ChatHistory.updateOne({ _id: claimed._id }, {
      ...(sent ? { $set: { discordNotifiedAt: new Date() } } : {}),
      $unset: { discordNotificationClaimedAt: '' },
    }, { maxTimeMS: 1500 }), 1800);
  } catch { console.warn('PlanBot notification could not be completed'); }
  return true;
}
