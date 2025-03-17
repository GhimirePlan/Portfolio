'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaGoogle, FaUser, FaSignOutAlt } from 'react-icons/fa6';

export default function UserProfileMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    if (isClient) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isClient]);

  const handleSignIn = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    setIsOpen(false);
  };

  if (!isClient || status === 'loading') {
    return (
      <div className="h-10 w-10 rounded-full bg-[#1a1443] animate-pulse"></div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <button
        onClick={handleSignIn}
        className="flex items-center gap-2 bg-[#16f2b3] text-[#1a1443] px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 transition-colors"
      >
        <FaGoogle />
        Sign In
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="User profile menu"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={40}
            height={40}
            className="rounded-full border-2 border-[#16f2b3]"
          />
        ) : (
          <div className="w-10 h-10 bg-[#16f2b3] rounded-full flex items-center justify-center">
            <span className="text-[#1a1443] font-bold">
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <span className="text-white hidden md:inline-block">{session.user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-[#1a1443] border border-[#1d293a] overflow-hidden z-50">
          <div className="p-3 border-b border-[#1d293a]">
            <p className="text-white font-medium truncate">{session.user.name}</p>
            <p className="text-gray-400 text-sm truncate">{session.user.email}</p>
          </div>
          
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#141b2d] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaUser size={16} />
              <span>My Profile</span>
            </Link>
            
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#141b2d] w-full text-left transition-colors"
            >
              <FaSignOutAlt size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 