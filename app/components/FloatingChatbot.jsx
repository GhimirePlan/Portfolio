'use client';
import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { FaRobot } from 'react-icons/fa';
const ChatbotModal = dynamic(() => import('./ChatbotModal'), { ssr: false });
export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const launcher = useRef(null);
  const close = useCallback(() => { setOpen(false); requestAnimationFrame(() => launcher.current?.focus()); }, []);
  return <><button ref={launcher} type="button" className="site-chat-launcher" aria-label="Open chatbot" aria-haspopup="dialog" onClick={() => setOpen(true)}><FaRobot aria-hidden="true" /></button>{open && <ChatbotModal isOpen onClose={close} />}</>;
}
