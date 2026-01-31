'use client';

import { SessionProvider } from 'next-auth/react';
import CommentSection from '@/app/components/blog/CommentSection';
import ShareButton from '@/app/components/blog/ShareButton';
import { BsShare, BsHeart } from 'react-icons/bs';

export default function ClientWrapper({ blogSlug }) {
  return (
    <SessionProvider>
      <div className="mt-12 space-y-8">
        {/* Share Section */}
        <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16f2b3]/20 to-[#60A5FA]/20 flex items-center justify-center">
                <BsShare className="text-[#16f2b3] text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Enjoyed this article?</h2>
                <p className="text-sm text-[#94a3b8]">Share it with others who might find it helpful</p>
              </div>
            </div>
            <ShareButton url={blogSlug} />
          </div>
        </div>

        {/* Appreciation Banner */}
        <div className="bg-gradient-to-r from-[#16f2b3]/10 via-[#60A5FA]/10 to-[#a78bfa]/10 border border-[#1d293a] rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BsHeart className="text-[#f43f5e] animate-pulse" />
            <span className="text-white font-medium">Thank you for reading!</span>
            <BsHeart className="text-[#f43f5e] animate-pulse" />
          </div>
          <p className="text-sm text-[#94a3b8]">
            Your engagement helps me create more quality content
          </p>
        </div>

        {/* Comments Section */}
        <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-2xl overflow-hidden shadow-lg">
          <div className="p-6 md:p-8 border-b border-[#1d293a] bg-gradient-to-r from-[#16f2b3]/5 to-[#60A5FA]/5">
            <h2 className="text-xl font-semibold text-white">Join the Discussion</h2>
            <p className="text-sm text-[#94a3b8] mt-1">Share your thoughts and connect with other readers</p>
          </div>
          <div className="p-6 md:p-8">
            <CommentSection blogSlug={blogSlug} />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
} 