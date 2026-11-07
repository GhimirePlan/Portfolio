'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from './components/navbar';
import Footer from './components/footer';
import FloatingChatbot from './components/FloatingChatbot';
const VisitorTracker = dynamic(() => import('./components/VisitorTracker'), { ssr: false });

let cancelSectionWait = () => {};

function scrollToSection(hash) {
  cancelSectionWait();
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const move = () => {
    const target = document.getElementById(id);
    if (!target) return false;
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 88), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return true;
  };
  if (move()) return;
  // Wait only when a route's section has not mounted yet.
  const container = document.getElementById('main-content');
  if (!container) return;
  const observer = new MutationObserver(() => { if (move()) cancelSectionWait(); });
  const timeout = setTimeout(() => observer.disconnect(), 10000);
  cancelSectionWait = () => { observer.disconnect(); clearTimeout(timeout); };
  observer.observe(container, { childList: true, subtree: true });
}

function handleSectionLink(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target.closest('a[href]');
  if (!anchor || anchor.target === '_blank' || anchor.getAttribute('href') === '#main-content') return;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
  event.preventDefault();
  if (location.hash !== url.hash) window.history.pushState(null, '', url.pathname + url.search + url.hash);
  scrollToSection(url.hash);
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  useEffect(() => {
    cancelSectionWait();
    if (!location.hash) return;
    const frame = requestAnimationFrame(() => scrollToSection(location.hash));
    return () => { cancelAnimationFrame(frame); cancelSectionWait(); };
  }, [pathname]);
  useEffect(() => {
    const updateOnline = () => { try { if (navigator.onLine) localStorage.setItem('lastOnlineTime', new Date().toISOString()); } catch {} };
    updateOnline();
    window.addEventListener('online', updateOnline);
    return () => window.removeEventListener('online', updateOnline);
  }, []);
  if (isAdmin) return <div className="admin-site">{children}</div>;
  return (
    <div className="public-site" onClickCapture={handleSectionLink}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <Suspense fallback={<div className="site-loading" role="status">Loading…</div>}>
        <main id="main-content" tabIndex={-1}>{children}</main>
      </Suspense>
      <Footer />
      {pathname !== '/planbot' && <FloatingChatbot />}
      <VisitorTracker showStatus={false} />
    </div>
  );
}
