'use client';

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BsLinkedin, 
  BsChevronLeft, 
  BsChevronRight,
  BsStarFill 
} from 'react-icons/bs';

// URL Conversion Logic
const convertToEmbedUrl = (url) => {
  if (!url) return '';
  
  // Clean the URL
  const cleanUrl = url.split('?')[0].replace(/\/$/, '');
  
  // Pattern 1: .../posts/activity-1234567890
  const activityMatch = cleanUrl.match(/activity-(\d+)/);
  if (activityMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}?collapsed=1`;
  }
  
  // Pattern 2: .../posts/ugcPost-1234567890
  const ugcMatch = cleanUrl.match(/ugcPost-(\d+)/);
  if (ugcMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcMatch[1]}?collapsed=1`;
  }

  // Fallback: Use encoded URL
  return `https://www.linkedin.com/embed/feed/update?url=${encodeURIComponent(url)}&collapsed=1`;
};

// Memoized Iframe Component for Performance
const LinkedInEmbed = memo(({ embedUrl, isActive, isNext }) => {
  // Only render if it's the active slide or the next one (preloading)
  if (!isActive && !isNext) return null;

  return (
    <div className={`w-full flex justify-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      <iframe 
        src={embedUrl}
        height="627" 
        width="504"
        frameBorder="0" 
        allowFullScreen 
        loading="lazy"
        title="Embedded post"
        className="rounded-[16px] shadow-lg border border-gray-200 dark:border-white/10 max-w-full"
      />
    </div>
  );
});

LinkedInEmbed.displayName = 'LinkedInEmbed';

const LinkedInSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/linkedin-posts');
      const data = await res.json();
      
      // Sort: Featured first, then by creation date
      const sortedPosts = Array.isArray(data) 
        ? [...data].sort((a, b) => {
            if (b.featured !== a.featured) return b.featured ? 1 : -1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          }) 
        : [];
        
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const nextPost = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  const prevPost = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  useEffect(() => {
    if (!isPaused && posts.length > 1) {
      timerRef.current = setInterval(nextPost, 5000); // Increased speed to 5 seconds
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextPost, posts.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 150 : -150, // More subtle movement
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    }),
  };

  if (loading && posts.length === 0) {
    return (
      <div id="linkedin" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0A66C2]"></div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div id="linkedin" className="relative z-50 border-t my-8 lg:my-16 border-[#25213b] overflow-hidden bg-gradient-to-b from-transparent via-[#0d1224]/50 to-transparent">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="w-[500px] h-[500px] bg-[#0A66C2]/10 rounded-full absolute -top-40 -left-40 blur-[120px] opacity-40 animate-pulse"></div>
        <div className="w-[500px] h-[500px] bg-violet-600/10 rounded-full absolute -bottom-40 -right-40 blur-[120px] opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      </div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-3 lg:py-4">
        <div className="flex items-center">
          <span className="w-16 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-4 text-lg lg:text-xl rounded-md flex items-center gap-2">
            <BsLinkedin className="text-[#0A66C2]" /> LinkedIn Spotlights
          </span>
          <span className="w-16 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative py-4 lg:py-6">
        {/* Navigation Arrows */}
        {posts.length > 1 && (
          <>
            <button 
              onClick={prevPost}
              className="absolute left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 text-white transition-all hidden md:flex backdrop-blur-md"
              aria-label="Previous post"
            >
              <BsChevronLeft size={24} />
            </button>
            <button 
              onClick={nextPost}
              className="absolute right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 text-white transition-all hidden md:flex backdrop-blur-md"
              aria-label="Next post"
            >
              <BsChevronRight size={24} />
            </button>
          </>
        )}

        <div 
          className="flex justify-center items-center min-h-[635px] relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={posts[currentIndex]._id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 35 }, // Much snappier
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                filter: { duration: 0.3 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) > 50;
                if (swipe) {
                  if (offset.x > 0) prevPost();
                  else nextPost();
                }
              }}
              className="w-full max-w-[550px] relative"
            >
              {posts[currentIndex].featured && (
                <div className="absolute -top-3 -right-3 flex items-center gap-1.5 bg-[#0A66C2] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest z-[30] shadow-xl border border-white/20">
                  <BsStarFill size={10} /> Featured
                </div>
              )}
              
              <div className="bg-white/5 dark:bg-[#1b203e]/60 backdrop-blur-2xl rounded-[28px] p-3 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group hover:border-[#0A66C2]/50 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/10 to-transparent rounded-[28px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <LinkedInEmbed 
                  embedUrl={convertToEmbedUrl(posts[currentIndex].url)} 
                  isActive={true}
                  isNext={false}
                />
              </div>

              {/* Preload Next Iframe (Hidden) */}
              <div className="hidden">
                <LinkedInEmbed 
                  embedUrl={convertToEmbedUrl(posts[(currentIndex + 1) % posts.length].url)} 
                  isActive={false}
                  isNext={true}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        {posts.length > 1 && (
          <div className="flex justify-center gap-3 mt-4 lg:mt-6">
            {posts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 transition-all duration-500 rounded-full ${
                  idx === currentIndex ? 'w-10 bg-[#0A66C2] shadow-[0_0_15px_rgba(10,102,194,0.5)]' : 'w-2 bg-white/10 hover:bg-white/30'
                }`}
                aria-label={`Go to post ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInSection;
