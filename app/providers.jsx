'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { LazyMotion, MotionConfig } from 'framer-motion';

const loadAnimationFeatures = () => import('./animation-features').then((module) => module.default);

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <LazyMotion features={loadAnimationFeatures}><MotionConfig reducedMotion="user">{children}</MotionConfig></LazyMotion>
      </ThemeProvider>
    </SessionProvider>
  );
} 