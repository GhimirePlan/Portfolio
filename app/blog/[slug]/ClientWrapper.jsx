'use client';

import { SessionProvider } from 'next-auth/react';
import CommentSection from '@/app/components/blog/CommentSection';
import ShareButton from '@/app/components/blog/ShareButton';

export default function ClientWrapper({ blogSlug }) {
  return (
    <SessionProvider>
      <div className="mt-10 flex flex-col gap-6">
        <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Share this article</h2>
          <ShareButton url={blogSlug} />
        </div>
        <CommentSection blogSlug={blogSlug} />
      </div>
    </SessionProvider>
  );
} 