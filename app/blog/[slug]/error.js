'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Blog post error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        We encountered an error while loading this blog post. This might be due to a temporary server issue or the content being unavailable.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-[#16f2b3] text-[#1a1443] px-6 py-2 rounded-full font-medium hover:bg-opacity-80 transition-colors"
        >
          Try again
        </button>
        <a
          href="/blog"
          className="border border-[#16f2b3] text-[#16f2b3] px-6 py-2 rounded-full font-medium hover:bg-[#16f2b3] hover:text-[#1a1443] transition-colors"
        >
          Back to Blogs
        </a>
      </div>
    </div>
  );
}
