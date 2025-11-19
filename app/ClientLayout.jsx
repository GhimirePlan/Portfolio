'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import FloatingChatbot from './components/FloatingChatbot';
import VisitorTracker from './components/VisitorTracker';

export default function ClientLayout({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    // Set initial online status
    try {
      setIsOnline(navigator.onLine);
      setIsBot(/bot|crawler|spider|crawling/i.test(navigator.userAgent || ''));
    } catch {}

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('ServiceWorker registration successful');
        } catch (err) {
          console.log('ServiceWorker registration failed: ', err);
        }
      }
    };

    // Track online status
    const updateOnlineStatus = () => {
      const isNavigatorOnline = navigator.onLine;
      setIsOnline(isNavigatorOnline);
      
      if (isNavigatorOnline) {
        try {
          localStorage.setItem('lastOnlineTime', new Date().toISOString());
        } catch {}
      }
    };

    // Add event listeners
    if (!isBot) {
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      window.addEventListener('load', registerServiceWorker);
    }
    
    // Set initial online time
    if (navigator.onLine) {
      try {
        localStorage.setItem('lastOnlineTime', new Date().toISOString());
      } catch {}
    }

    // Cleanup
    return () => {
      if (!isBot) {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        window.removeEventListener('load', registerServiceWorker);
      }
    };
  }, []);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-bounce text-primary">Loading...</div>
      </div>
    }>
      {children}
      {!isBot && <FloatingChatbot />}
      {!isBot && <VisitorTracker showStatus={false} />}
    </Suspense>
  );
}