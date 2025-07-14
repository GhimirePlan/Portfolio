'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import FloatingChatbot from './components/FloatingChatbot';

export default function ClientLayout({ children }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

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
        localStorage.setItem('lastOnlineTime', new Date().toISOString());
      }
    };

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('load', registerServiceWorker);
    
    // Set initial online time
    if (navigator.onLine) {
      localStorage.setItem('lastOnlineTime', new Date().toISOString());
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('load', registerServiceWorker);
    };
  }, []);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-bounce text-primary">Loading...</div>
      </div>
    }>
      {children}
      <FloatingChatbot />
    </Suspense>
  );
}