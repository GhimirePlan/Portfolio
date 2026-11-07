'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'framer-motion';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </SessionProvider>
  );
} 