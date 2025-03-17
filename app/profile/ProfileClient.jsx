'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

export default function ProfileClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Show loading state during SSR or when status is loading
  if (!isClient || status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16f2b3]"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-[#16f2b3] hover:text-[#60A5FA] transition-colors">
          <FaArrowLeft className="mr-2" />
          Back to home
        </Link>
      </div>
      
      <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg overflow-hidden shadow-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {session.user.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name} 
              width={120} 
              height={120} 
              className="rounded-full border-4 border-[#16f2b3]"
            />
          ) : (
            <div className="w-32 h-32 bg-[#16f2b3] rounded-full flex items-center justify-center">
              <span className="text-[#1a1443] text-4xl font-bold">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{session.user.name}</h1>
            <p className="text-gray-400 mb-4">{session.user.email}</p>
            
            <div className="bg-[#141b2d] p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Account Type</p>
                  <p className="text-white">{session.user.provider === 'google' ? 'Google Account' : 'Email Account'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white capitalize">{session.user.role || 'User'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#141b2d] p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Activity</h2>
              <p className="text-gray-400">You can view your recent activity here.</p>
              
              <div className="mt-4">
                <Link 
                  href="/blog" 
                  className="inline-block bg-[#16f2b3] text-[#1a1443] px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 transition-colors"
                >
                  Browse Blog Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 