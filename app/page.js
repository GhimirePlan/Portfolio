'use client';

import { personalData } from "@/utils/data/personal-data";
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { FaSun, FaMoon, FaSearch, FaUser, FaBars, FaTimes, 
         FaHome, FaInfo, FaCode, FaBlog, FaEnvelope, 
         FaUserCircle, FaChartBar, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import Link from 'next/link';
import './css/homepage.css';

// Eagerly load Hero as it's above the fold
import HeroSection from "./components/homepage/hero-section";

// Lazy load heavy components and sections below the fold
const AboutSection = dynamic(() => import("./components/homepage/about"), {
  ssr: false,
  loading: () => <div className="min-h-[520px] animate-pulse bg-slate-900/20" />
});
const Experience = dynamic(() => import("./components/homepage/experience"), {
  ssr: false,
  loading: () => <div className="min-h-screen animate-pulse bg-slate-900/20" />
});
const LinkedInSection = dynamic(() => import("./components/homepage/LinkedInSection"), {
  ssr: false,
  loading: () => <div className="min-h-[400px] animate-pulse bg-slate-900/20" />
});
const Blog = dynamic(() => import("./components/homepage/blog"), {
  ssr: false,
  loading: () => <div className="min-h-[400px] animate-pulse bg-slate-900/20" />
});
const ContactSection = dynamic(() => import("./components/homepage/contact"), {
  ssr: false,
  loading: () => <div className="min-h-screen animate-pulse bg-slate-900/20" />
});

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  // Treat "unset" theme as dark so SSR keeps the navy identity (no light flash)
  const isDark = theme !== 'light';
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Example user data
  const user = {
    name: 'Plan Ghimire',
    image: '/images/profile.jpg',
    role: 'Admin'
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll-spy: track the section currently in view for the active underline
  useEffect(() => {
    const sectionIds = ['about', 'blog', 'contact'];
    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 140;
      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScrollSpy();
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
    };
  }, []);

  // Handle theme toggle
  useEffect(() => {
    setMounted(true);
    console.log('Home page mounted, current theme:', theme);
  }, [theme]);

  // Handle click outside of user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && searchFocused) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchFocused]);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="portfolio-home">
      {/* Refined Sticky Navbar */}
      <div
        id="homepage-navbar"
        className={`fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
        style={{
          backgroundColor: isDark ? 'rgba(13, 18, 36, 0.82)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${isDark ? 'rgba(22, 242, 179, 0.18)' : 'rgba(18, 194, 146, 0.25)'}`,
          boxShadow: scrolled
            ? (isDark ? '0 4px 20px rgba(0, 0, 0, 0.28)' : '0 4px 20px rgba(0, 0, 0, 0.08)')
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className="font-bold text-lg sm:text-xl tracking-tight transition-colors duration-300 flex items-center"
              style={{ color: isDark ? '#16f2b3' : '#12c292' }}
            >
              <span className="homepage-signature">Plan Ghimire</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <label htmlFor="homepage-search" className="sr-only">Search</label>
              <input
                id="homepage-search"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="pl-9 pr-3 py-1.5 rounded-full text-sm focus:outline-none w-32 lg:w-40 focus:w-44 lg:focus:w-56 transition-all duration-300"
                style={{
                  backgroundColor: isDark ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                  color: isDark ? '#fff' : '#1a202c',
                  border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
                  boxShadow: searchFocused ? `0 0 0 2px ${isDark ? 'rgba(22, 242, 179, 0.3)' : 'rgba(18, 194, 146, 0.3)'}` : 'none'
                }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FaSearch size={13} style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
              </div>
              
              {/* Search Suggestions */}
              {searchFocused && searchQuery.length > 0 && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg overflow-hidden z-10"
                  style={{
                    backgroundColor: isDark ? '#1a223a' : '#fff',
                    border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
                  }}
                >
                  <div className="py-1">
                    <a 
                      href="/blog/javascript-tips" 
                      className="block px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                      style={{
                        color: isDark ? '#fff' : '#1a202c',
                        backgroundColor: searchQuery.toLowerCase().includes('javascript') ? 
                          (isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)') : 'transparent'
                      }}
                    >
                      <FaBlog className="inline mr-2" size={12} />
                      JavaScript Tips & Tricks
                    </a>
                    <a 
                      href="/about" 
                      className="block px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                      style={{
                        color: isDark ? '#fff' : '#1a202c',
                        backgroundColor: searchQuery.toLowerCase().includes('about') ? 
                          (isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)') : 'transparent'
                      }}
                    >
                      <FaInfo className="inline mr-2" size={12} />
                      About Plan Ghimire
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation Links */}
            <nav aria-label="Primary" className="flex items-center gap-0.5">
              {['Home', 'About', 'Blog', 'Contact'].map((item, index) => {
                const icons = [FaHome, FaInfo, FaCode, FaEnvelope];
                const Icon = icons[index];
                const href = item === 'Home' ? '#home' : `#${item.toLowerCase()}`;
                const isActive = item.toLowerCase() === activeSection;
                
                return (
                  <Link 
                    key={item} 
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className="relative px-3 py-2 rounded-md text-sm font-medium group"
                    style={{
                      color: isActive
                        ? (isDark ? '#16f2b3' : '#12c292')
                        : (isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(26, 32, 44, 0.85)'),
                    }}
                  >
                    <span className="relative z-10 flex items-center">
                      <Icon className="mr-1.5" size={14} />
                      {item}
                    </span>
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-transform duration-300 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                      style={{ 
                        backgroundColor: isDark ? '#16f2b3' : '#12c292',
                      }}
                    />
                  </Link>
                );
              })}
            </nav>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60"
              style={{
                backgroundColor: isDark ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                boxShadow: `0 0 10px ${isDark ? 'rgba(22, 242, 179, 0.2)' : 'rgba(18, 194, 146, 0.2)'}`
              }}
              aria-label="Toggle color theme"
            >
              {mounted && isDark ? (
                <FaMoon className="text-blue-500" size={20} />
              ) : (
                <FaSun className="text-yellow-500" size={20} />
              )}
            </button>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 rounded-full"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <div 
                  className="w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                  style={{ 
                    borderColor: isDark ? '#16f2b3' : '#12c292',
                    backgroundColor: isDark ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                  }}
                >
                  {isAuthenticated ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaUser size={14} style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(26, 32, 44, 0.7)' }} />
                  )}
                </div>
              </button>
              
              {/* User Dropdown */}
              <div 
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden transition-all duration-300 ${
                  userMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
                style={{
                  backgroundColor: isDark ? '#1a223a' : '#fff',
                  border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
                  zIndex: 50
                }}
              >
                {isAuthenticated ? (
                  <>
                    <div 
                      className="px-4 py-3 border-b"
                      style={{ borderColor: isDark ? '#2d3748' : '#e2e8f0' }}
                    >
                      <p className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#1a202c' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(26, 32, 44, 0.6)' }}>{user.role}</p>
                    </div>
                    <a 
                      href="/profile" 
                      className="block px-4 py-2 text-sm transition-colors duration-150"
                      style={{
                        color: isDark ? '#fff' : '#1a202c',
                        backgroundColor: 'transparent',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FaUserCircle className="inline mr-2" /> My Profile
                    </a>
                    <a 
                      href="/dashboard" 
                      className="block px-4 py-2 text-sm transition-colors duration-150"
                      style={{
                        color: isDark ? '#fff' : '#1a202c',
                        backgroundColor: 'transparent',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FaChartBar className="inline mr-2" /> Dashboard
                    </a>
                    <a 
                      href="/settings" 
                      className="block px-4 py-2 text-sm transition-colors duration-150"
                      style={{
                        color: isDark ? '#fff' : '#1a202c',
                        backgroundColor: 'transparent',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FaCog className="inline mr-2" /> Settings
                    </a>
                    <button
                      onClick={() => setIsAuthenticated(false)}
                      className="block w-full text-left px-4 py-2 text-sm transition-colors duration-150"
                      style={{
                        color: isDark ? '#fff' : '#1a202c',
                        backgroundColor: 'transparent',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsAuthenticated(true)}
                      className="block w-full text-left px-4 py-2 text-sm transition-colors duration-150"
                      style={{
                        color: isDark ? '#fff' : '#1a202c',
                        backgroundColor: 'transparent',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FaSignInAlt className="inline mr-2" /> Sign In
                    </button>
                    <a 
                      href="/admin" 
                      className="block px-4 py-2 text-sm transition-colors duration-150"
                      style={{
                        color: isDark ? '#fff' : '#1a202c',
                        backgroundColor: 'transparent',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FaUserPlus className="inline mr-2" /> Register
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60"
              style={{
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                backgroundColor: mobileMenuOpen ? 
                  (isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)') : 
                  'transparent'
              }}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <FaTimes size={22} />
              ) : (
                <FaBars size={22} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            backgroundColor: isDark ? 'rgba(13, 18, 36, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderTop: `1px solid ${isDark ? 'rgba(45, 55, 72, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
          }}
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {/* Mobile Search */}
            <div className="relative my-4">
              <label htmlFor="mobile-search" className="sr-only">Search</label>
              <input
                id="mobile-search"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full text-sm focus:outline-none"
                style={{
                  backgroundColor: isDark ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                  color: isDark ? '#fff' : '#1a202c',
                  border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
                  boxShadow: `0 0 0 1px ${isDark ? 'rgba(22, 242, 179, 0.3)' : 'rgba(18, 194, 146, 0.3)'}`
                }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FaSearch size={13} style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
              </div>
            </div>
            
            {/* Mobile Links */}
            {['Home', 'About', 'Blog', 'Contact'].map((item, index) => {
              const icons = [FaHome, FaInfo, FaCode, FaEnvelope];
              const Icon = icons[index];
              const href = item === 'Home' ? '#home' : `#${item.toLowerCase()}`;
              const isActive = item.toLowerCase() === activeSection;
              
              return (
                <a 
                  key={item} 
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors duration-150"
                  style={{
                    color: isActive
                      ? (isDark ? '#16f2b3' : '#12c292')
                      : (isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)'),
                    backgroundColor: 'transparent',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Icon className="mr-3" size={18} />
                  {item}
                </a>
              );
            })}
            
            {/* Mobile User Authentication */}
            <div className="pt-4 border-t" style={{ borderColor: isDark ? 'rgba(45, 55, 72, 0.5)' : 'rgba(226, 232, 240, 0.8)' }}>
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="flex items-center px-3 py-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 mr-3 flex-shrink-0"
                      style={{ borderColor: isDark ? '#16f2b3' : '#12c292' }}
                    >
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(26, 32, 44, 0.6)' }}>{user.role}</p>
                    </div>
                  </div>
                  <a 
                    href="/profile" 
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                    style={{
                      color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaUserCircle className="mr-3" size={16} /> My Profile
                  </a>
                  <a 
                    href="/dashboard" 
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                    style={{
                      color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaChartBar className="mr-3" size={16} /> Dashboard
                  </a>
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                    style={{
                      color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaSignOutAlt className="mr-3" size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => setIsAuthenticated(true)}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-150"
                    style={{
                      color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaSignInAlt className="mr-3" size={18} /> Sign In
                  </button>
                  <a 
                    href="/admin" 
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-150"
                    style={{
                      color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaUserPlus className="mr-3" size={18} /> Register
                  </a>
                </div>
              )}
              
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between mt-4 px-3 py-3">
                <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)' }}>Theme Mode</span>
                <button 
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 text-sm font-medium"
                  style={{ color: isDark ? '#16f2b3' : '#12c292' }}
                  aria-label="Toggle color theme"
                >
                  {mounted && isDark ? (
                    <>
                      <span>Light Mode</span>
                      <FaSun size={16} />
                    </>
                  ) : (
                    <>
                      <span>Dark Mode</span>
                      <FaMoon size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed navbar */}
      <div className="homepage-nav-spacer"></div>

      {/* Your existing homepage content */}
      <HeroSection />
      <Suspense fallback={<div className="min-h-[520px] animate-pulse bg-slate-900/20" />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-900/20" />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<div className="min-h-[400px] animate-pulse bg-slate-900/20" />}>
        <Blog />
      </Suspense>
      <Suspense fallback={<div className="min-h-[400px] animate-pulse bg-slate-900/20" />}>
        <LinkedInSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-900/20" />}>
        <ContactSection />
      </Suspense>
    </div>
  );
}
