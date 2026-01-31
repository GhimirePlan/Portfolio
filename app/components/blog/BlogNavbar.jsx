'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { FaSun, FaMoon, FaSearch, FaUser, FaBars, FaTimes, 
         FaHome, FaInfo, FaCode, FaBlog, FaEnvelope, 
         FaUserCircle, FaChartBar, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import Link from 'next/link';

export default function BlogNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Handle theme toggle
  useEffect(() => {
    setMounted(true);
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
    setTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <div
      id="blog-navbar"
      className={`fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-300 ${
        scrolled ? 'py-2 shadow-lg' : 'py-4'
      }`}
      style={{
        backgroundColor: theme === 'dark' 
          ? 'rgba(13, 18, 36, 0.95)' // Dark mode
          : 'rgba(255, 255, 255, 0.95)', // Light mode
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `4px solid ${theme === 'dark' ? '#16f2b3' : '#12c292' }`,
        boxShadow: `0 4px 20px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link 
            href="/" 
            className="font-bold text-xl transition-colors duration-300 flex items-center"
            style={{ color: theme === 'dark' ? '#16f2b3' : '#12c292' }}
          >
            <span className="mr-2">Plan Ghimire</span>
            <span className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">Portfolio</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 w-40 focus:w-64 transition-all duration-300"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                color: theme === 'dark' ? '#fff' : '#1a202c',
                borderColor: theme === 'dark' ? '#2d3748' : '#e2e8f0',
                boxShadow: searchFocused ? `0 0 0 2px ${theme === 'dark' ? 'rgba(22, 242, 179, 0.3)' : 'rgba(18, 194, 146, 0.3)'}` : 'none'
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FaSearch size={14} style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
            </div>
            
            {/* Search Suggestions */}
            {searchFocused && searchQuery.length > 0 && (
              <div 
                className="absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg overflow-hidden z-10"
                style={{
                  backgroundColor: theme === 'dark' ? '#1a223a' : '#fff',
                  border: `1px solid ${theme === 'dark' ? '#2d3748' : '#e2e8f0'}`,
                }}
              >
                <div className="py-1">
                  <a 
                    href="/blog" 
                    className="block px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                    style={{
                      color: theme === 'dark' ? '#fff' : '#1a202c',
                      backgroundColor: searchQuery.toLowerCase().includes('blog') ? 
                        (theme === 'dark' ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)') : 'transparent'
                    }}
                  >
                    <FaBlog className="inline mr-2" size={12} />
                    Search in Blog
                  </a>
                  <a 
                    href="/#about" 
                    className="block px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                    style={{
                      color: theme === 'dark' ? '#fff' : '#1a202c',
                      backgroundColor: searchQuery.toLowerCase().includes('about') ? 
                        (theme === 'dark' ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)') : 'transparent'
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
          <div className="flex items-center space-x-1">
            {['Home', 'About', 'Blog', 'Contact'].map((item, index) => {
              const icons = [FaHome, FaInfo, FaCode, FaBlog, FaEnvelope];
              const Icon = icons[index];
              // Modified href for Blog page: point to homepage sections (except Home which is /)
              const href = item === 'Home' ? '/' : `/#${item.toLowerCase()}`;
              
              return (
                <Link 
                  key={item} 
                  href={href}
                  className="relative px-3 py-2 rounded-md text-sm font-medium group overflow-hidden"
                  style={{
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    <Icon className="mr-1" size={14} />
                    {item}
                  </span>
                  <span 
                    className="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"
                    style={{ 
                      backgroundColor: theme === 'dark' ? '#16f2b3' : '#12c292',
                    }}
                  />
                  <span 
                    className="absolute inset-0 w-full h-full bg-current transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-md z-0 opacity-10"
                  />
                </Link>
              );
            })}
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
              boxShadow: `0 0 10px ${theme === 'dark' ? 'rgba(22, 242, 179, 0.2)' : 'rgba(18, 194, 146, 0.2)'}`
            }}
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? (
              <FaSun className="text-yellow-300" size={18} />
            ) : (
              <FaMoon className="text-blue-500" size={16} />
            )}
          </button>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center focus:outline-none"
              aria-label="User menu"
            >
              <div 
                className="w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                style={{ 
                  borderColor: theme === 'dark' ? '#16f2b3' : '#12c292',
                  backgroundColor: theme === 'dark' ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                }}
              >
                {isAuthenticated ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <FaUser style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(26, 32, 44, 0.7)' }} />
                )}
              </div>
            </button>
            
            {/* User Dropdown */}
            <div 
              className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden transition-all duration-300 ${
                userMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{
                backgroundColor: theme === 'dark' ? '#1a223a' : '#fff',
                border: `1px solid ${theme === 'dark' ? '#2d3748' : '#e2e8f0'}`,
                zIndex: 50
              }}
            >
              {isAuthenticated ? (
                <>
                  <div 
                    className="px-4 py-3 border-b"
                    style={{ borderColor: theme === 'dark' ? '#2d3748' : '#e2e8f0' }}
                  >
                    <p className="text-sm font-medium" style={{ color: theme === 'dark' ? '#fff' : '#1a202c' }}>{user.name}</p>
                    <p className="text-xs" style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(26, 32, 44, 0.6)' }}>{user.role}</p>
                  </div>
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                    style={{
                      color: theme === 'dark' ? '#fff' : '#1a202c',
                      backgroundColor: 'transparent',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaSignOutAlt className="inline mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsAuthenticated(true)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                    style={{
                      color: theme === 'dark' ? '#fff' : '#1a202c',
                      backgroundColor: 'transparent',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaSignInAlt className="inline mr-2" /> Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md transition-colors duration-200"
            style={{
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
              backgroundColor: mobileMenuOpen ? 
                (theme === 'dark' ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)') : 
                'transparent'
            }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <FaTimes size={24} />
            ) : (
              <FaBars size={24} />
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
          backgroundColor: theme === 'dark' ? 'rgba(13, 18, 36, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderTop: `1px solid ${theme === 'dark' ? 'rgba(45, 55, 72, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
        }}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          {/* Mobile Search */}
          <div className="relative my-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all duration-300"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                color: theme === 'dark' ? '#fff' : '#1a202c',
                borderColor: theme === 'dark' ? '#2d3748' : '#e2e8f0',
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FaSearch size={14} style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
            </div>
          </div>
          
          {['Home', 'About', 'Blog', 'Contact'].map((item) => {
             const href = item === 'Home' ? '/' : `/#${item.toLowerCase()}`;
             return (
              <Link 
                key={item} 
                href={href}
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                style={{
                  color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                }}
                onClick={() => setMobileMenuOpen(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(22, 242, 179, 0.1)' : 'rgba(18, 194, 146, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-gray-700 flex justify-between items-center">
             <span className="text-sm" style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(26, 32, 44, 0.7)' }}>
               Theme
             </span>
             <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
              }}
            >
              {mounted && theme === 'dark' ? (
                <FaSun className="text-yellow-300" size={18} />
              ) : (
                <FaMoon className="text-blue-500" size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
