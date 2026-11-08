'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import ChatMessageText from '@/app/components/ChatMessageText';
import { chatContext, chatError, PLANBOT_WELCOME } from '@/utils/planbot-client';

import './planbot.css';
const getSessionId = () => {
  let stored; try { stored = localStorage.getItem('chatSessionId'); } catch {}
  if (stored) return stored;
  const id = crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);
  try { localStorage.setItem('chatSessionId', id); } catch {}
  return id;
};
export default function PlanBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const submitting = useRef(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentElement;
    container?.scrollTo({ top: container.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const sid = getSessionId(); setSessionId(sid);
    const controller = new AbortController();
    setIsLoading(true);
    axios.get(`/api/chatbot/history?sessionId=${encodeURIComponent(sid)}`, { signal: controller.signal, timeout: 8000 })
      .then(({data}) => { if (!controller.signal.aborted) setMessages(data?.data?.messages?.length ? data.data.messages.map((m,i)=>({...m,id:i,timestamp:new Date(m.timestamp || Date.now())})) : [{id:'welcome',text:PLANBOT_WELCOME,sender:'bot',timestamp:new Date()}]); })
      .catch(() => { if (!controller.signal.aborted) setMessages([{id:'welcome',text:PLANBOT_WELCOME,sender:'bot',timestamp:new Date()}]); })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
      return () => controller.abort();
  }, []);
  const handleSendMessage = async event => {
    event.preventDefault();
    if (!input.trim() || isLoading || submitting.current) return;
    submitting.current = true; setIsLoading(true);
    const text = input.trim(); setInput('');
    setMessages(previous => [...previous, {id:Date.now(),text,sender:'user',timestamp:new Date()}]);
    try {
      const response = await axios.post('/api/planbot', {message:text,sessionId,history:chatContext(messages)}, {timeout:45000});
      if (!response.data?.success || typeof response.data?.data?.response !== 'string') throw new Error('Invalid chat response');
      if (response.data.data.sessionId) { setSessionId(response.data.data.sessionId); try { localStorage.setItem('chatSessionId',response.data.data.sessionId); } catch {} }
      setMessages(previous => [...previous,{id:Date.now(),text:response.data.data.response,sender:'bot',timestamp:new Date()}]);
    } catch(error) {
      setMessages(previous => [...previous,{id:Date.now(),text:chatError(error),sender:'bot',isError:true,timestamp:new Date()}]);
    } finally { submitting.current=false;setIsLoading(false); }
  };
  return <section className="site-planbot planbot-page">
    <header className="planbot-heading"><span className="planbot-mark"><FaRobot /></span><div><h1>PlanBot</h1><p>Plan’s portfolio assistant</p></div><span className="planbot-heading-note">A little curiosity goes a long way.</span></header>
    <div className="planbot-window">
      <div className="planbot-messages" role="log" aria-label="Conversation" aria-live="polite" aria-busy={isLoading}>
        {messages.map((message,index)=><article key={index} className={`planbot-message ${message.sender==='user'?'from-user':'from-bot'} ${message.isError?'is-error':''}`}><div className="planbot-message-meta"><strong>{message.sender==='user'?'You':'PlanBot'}</strong><time>{message.timestamp.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</time></div><div className="planbot-message-text"><ChatMessageText text={message.text}/></div></article>)}
        {isLoading&&<p className="planbot-thinking" role="status">{messages.length?'Thinking…':'Loading your conversation…'}</p>}
        <div ref={messagesEndRef}/>
      </div>
      {messages.length===1&&!isLoading&&<div className="planbot-prompts" aria-label="Suggested questions">{['What does Plan work on?','How can I contact Plan?','Tell me about his studies.'].map(prompt=><button type="button" key={prompt} onClick={()=>setInput(prompt)}>{prompt}</button>)}</div>}
      <form className="planbot-composer" onSubmit={handleSendMessage}><input type="text" aria-label="Your message" value={input} maxLength={4000} onChange={e=>setInput(e.target.value)} placeholder="Ask about Plan’s work…" disabled={isLoading}/><button type="submit" aria-label="Send message" disabled={!input.trim()||isLoading}><FaPaperPlane/></button></form>
    </div><p className="planbot-footnote">Ask about projects, studies, or getting in touch. Answers may occasionally be inaccurate.</p>
  </section>;
}
