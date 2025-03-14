'use client';

import { SessionProvider } from 'next-auth/react';

export function AdminProviders({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 