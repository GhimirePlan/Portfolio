'use client';

import { useEffect, useRef } from 'react';

export default function BlogAnimate({ children }) {
  const observerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, blockquote, ul, ol, pre, figure, table, iframe'
    );

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const delay = Math.min(index * 50, 500);
            entry.target.style.animationDelay = `${delay}ms`;
            entry.target.classList.add('animate-fade-in-up');
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    elements.forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return <div ref={contentRef}>{children}</div>;
}
