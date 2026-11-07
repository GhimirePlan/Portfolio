'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ChatHistoryView({ sessionId }) {
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true });
    fetch(`/api/admin/chats?${sessionId ? `sessionId=${encodeURIComponent(sessionId)}` : `page=${page}`}`, { cache: 'no-store', signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to load conversations.'); return data; })
      .then(data => setState({ data }))
      .catch(error => { if (!controller.signal.aborted) setState({ error: error.message }); });
    return () => controller.abort();
  }, [sessionId, page, refresh]);
  return <section className="mx-auto w-full max-w-4xl text-slate-100">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>{sessionId && <Link href="/admin/chats" className="text-sm text-teal-300">← All conversations</Link>}<h1 className="mt-2 text-2xl font-semibold">{sessionId ? 'Conversation' : 'PlanBot conversations'}</h1><p className="mt-2 break-all text-sm text-slate-400">{sessionId || 'Recent visitor chats. Only admins can access this page.'}</p></div>
      <button type="button" onClick={() => setRefresh(value => value + 1)} className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:border-teal-300">Refresh</button>
    </div>
    <div aria-live="polite">
      {state.loading && <p className="text-slate-400">Loading conversations…</p>}
      {state.error && <p role="alert" className="rounded-xl border border-red-400/30 p-4 text-sm text-red-300">{state.error}</p>}
      {state.data && (sessionId ? <div className="space-y-3">{state.data.chat.messages.length === 500 && <p className="text-sm text-slate-400">Showing the latest 500 messages.</p>}{state.data.chat.messages.map((message, index) => <article key={message._id || index} className={`rounded-xl border p-4 ${message.sender === 'user' ? 'border-slate-600 bg-slate-800/40' : 'border-teal-500/20 bg-teal-950/20'}`}>
        <div className="mb-2 flex justify-between gap-4 text-xs text-slate-400"><strong className="text-slate-200">{message.sender === 'user' ? 'Visitor' : 'PlanBot'}</strong><time>{new Date(message.timestamp).toLocaleString()}</time></div><p className="whitespace-pre-wrap break-words text-sm leading-7">{message.text}</p>
      </article>)}</div> : <>
        {!state.data.chats.length && <p className="rounded-xl border border-slate-700 p-6 text-sm text-slate-400">No conversations yet.</p>}
        <div className="space-y-3">{state.data.chats.map(chat => <Link key={chat._id} href={`/admin/chats/${encodeURIComponent(chat.sessionId)}`} className="block rounded-xl border border-slate-700 p-4 transition-colors hover:border-teal-400">
          <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-400"><span className="break-all">{chat.sessionId}</span><time>{new Date(chat.updatedAt).toLocaleString()}</time></div><p className="mt-2 line-clamp-2 break-words text-sm">{chat.messages[0]?.text || 'No messages'}</p><span className="mt-3 inline-block text-xs text-teal-300">Read conversation →</span>
        </Link>)}</div><div className="mt-5 flex items-center gap-4 text-sm"><button disabled={page === 1} onClick={() => setPage(value => value - 1)} className="disabled:opacity-30">← Previous</button><span>Page {page}</span><button disabled={!state.data.hasMore} onClick={() => setPage(value => value + 1)} className="disabled:opacity-30">Next →</button></div>
      </>)}
    </div>
  </section>;
}
