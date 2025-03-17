'use client';

import { useState, useRef, useEffect } from 'react';
import { BsShare, BsX, BsFacebook, BsTwitterX, BsLinkedin, BsWhatsapp, BsLink45Deg } from 'react-icons/bs';
import { FaXTwitter } from 'react-icons/fa6';

export default function ShareButton({ url }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const fullUrl = typeof window !== 'undefined' ? window.location.href : '';
  const postTitle = typeof window !== 'undefined' ? document.title : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleShare = () => {
    setIsOpen(!isOpen);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          url: fullUrl
        });
        setIsOpen(false);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setIsOpen(false), 1500);
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <BsFacebook size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: 'bg-[#1877F2] hover:bg-[#0E65D9]'
    },
    {
      name: 'Twitter',
      icon: <FaXTwitter size={20} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(postTitle)}`,
      color: 'bg-[#000000] hover:bg-[#333333]'
    },
    {
      name: 'LinkedIn',
      icon: <BsLinkedin size={20} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: 'bg-[#0A66C2] hover:bg-[#084E96]'
    },
    {
      name: 'WhatsApp',
      icon: <BsWhatsapp size={20} />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + ' ' + fullUrl)}`,
      color: 'bg-[#25D366] hover:bg-[#1DA851]'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center gap-2 text-[#16f2b3] hover:text-[#60A5FA] transition-colors px-4 py-2 rounded-full border border-[#1d293a] hover:border-[#60A5FA]"
        onClick={handleShare}
        aria-label="Share this article"
      >
        <BsShare />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 rounded-lg shadow-lg bg-[#1a1443] border border-[#1d293a] p-4 right-0">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium">Share this article</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close share menu"
            >
              <BsX size={24} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} text-white p-2 rounded-full flex items-center justify-center transition-colors`}
                aria-label={`Share on ${link.name}`}
                onClick={() => setTimeout(() => setIsOpen(false), 500)}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full bg-[#16f2b3] text-[#1a1443] py-2 px-4 rounded-lg font-medium hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
              >
                <BsShare />
                Share via device
              </button>
            )}
            
            <button
              onClick={handleCopyLink}
              className="w-full bg-[#141b2d] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1d293a] transition-colors flex items-center justify-center gap-2"
            >
              <BsLink45Deg size={20} />
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 