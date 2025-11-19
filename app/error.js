'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Captured client error:', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="max-w-md text-center px-6">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="mb-6">An unexpected error occurred. Please try again.</p>
          <button
            className="bg-[#12c292] text-[#071318] px-4 py-2 rounded-md font-semibold"
            onClick={() => reset()}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}