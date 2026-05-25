'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { FaSun, FaMoon, FaSearch, FaUser, FaBars, FaTimes, 
         FaHome, FaInfo, FaCode, FaBlog, FaEnvelope, 
         FaUserCircle, FaChartBar, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaGoogle } from "react-icons/fa";

function Navbar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

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
  }, []);

  // Handle click outside of user menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignIn = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    setUserMenuOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2 shadow-lg' : 'py-4'
        }`}
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(13, 18, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: `4px solid ${theme === 'dark' ? '#16f2b3' : '#12c292'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white font-bold text-xl hover:text-[#16f2b3] transition-colors duration-300">
                Plan Ghimire
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search bar */}
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 w-40 focus:w-64 transition-all duration-300"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                    color: theme === 'dark' ? '#fff' : '#1a202c',
                    borderColor: theme === 'dark' ? '#2d3748' : '#e2e8f0',
                  }}
                  onFocus={() => setSearchFocused(true)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaSearch size={14} style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
                </div>
              </div>

              {/* Navigation links */}
              <div className="flex items-center space-x-1">
                {['Home', 'About', 'Blog', 'Contact', 'PlanBot'].map((item, index) => {
                  const icons = [FaHome, FaInfo, FaBlog, FaEnvelope, FaRobot];
                  const Icon = icons[index];
                  const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                  
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
                    </Link>
                  );
                })}
              </div>

              {/* Theme toggle */}
              <button 
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(26, 34, 58, 0.8)' : 'rgba(247, 250, 252, 0.8)',
                }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FaSun className="text-yellow-300" size={18} />
                ) : (
                  <FaMoon className="text-blue-500" size={16} />
                )}
              </button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                {status === 'authenticated' ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center focus:outline-none"
                      aria-label="User menu"
                    >
                      <div 
                        className="w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-110"
                        style={{ 
                          borderColor: theme === 'dark' ? '#16f2b3' : '#12c292',
                        }}
                      >
                        {session.user.image ? (
                          <Image 
                            src={session.user.image} 
                            alt={session.user.name} 
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#16f2b3] flex items-center justify-center">
                            <span className="text-[#1a1443] font-bold">
                              {session.user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>

                    {userMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden"
                        style={{
                          backgroundColor: theme === 'dark' ? '#1a223a' : '#fff',
                          border: `1px solid ${theme === 'dark' ? '#2d3748' : '#e2e8f0'}`,
                        }}
                      >
                        <div 
                          className="px-4 py-3 border-b"
                          style={{ borderColor: theme === 'dark' ? '#2d3748' : '#e2e8f0' }}
                        >
                          <p className="text-sm font-medium" style={{ color: theme === 'dark' ? '#fff' : '#1a202c' }}>
                            {session.user.name}
                          </p>
                          <p className="text-xs" style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(26, 32, 44, 0.6)' }}>
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                            style={{
                              color: theme === 'dark' ? '#fff' : '#1a202c',
                              backgroundColor: 'transparent',
                            }}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaUserCircle className="mr-2" size={16} />
                            Profile
                          </Link>
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                            style={{
                              color: theme === 'dark' ? '#fff' : '#1a202c',
                              backgroundColor: 'transparent',
                            }}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaChartBar className="mr-2" size={16} />
                            Dashboard
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-150"
                            style={{
                              color: theme === 'dark' ? '#fff' : '#1a202c',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <FaSignOutAlt className="mr-2" size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="flex items-center gap-2 bg-[#16f2b3] text-[#1a1443] px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 transition-colors"
                  >
                    <FaGoogle />
                    Sign In
                  </button>
                )}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md hover:bg-opacity-10 transition-colors duration-200"
                style={{
                  color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
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
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed inset-x-0 top-[72px] transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(13, 18, 36, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderTop: `1px solid ${theme === 'dark' ? 'rgba(45, 55, 72, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
        }}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          {/* Mobile search */}
          <div className="relative my-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2"
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

          {/* Mobile links */}
          {['Home', 'About', 'Blog', 'Contact', 'PlanBot'].map((item, index) => {
            const icons = [FaHome, FaInfo, FaBlog, FaEnvelope, FaRobot];
            const Icon = icons[index];
            const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
            
            return (
              <Link 
                key={item} 
                href={href}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors duration-150"
                style={{
                  color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                  backgroundColor: 'transparent',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="mr-3" size={18} />
                {item}
              </Link>
            );
          })}

          {/* Mobile user section */}
          <div className="pt-4 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(45, 55, 72, 0.5)' : 'rgba(226, 232, 240, 0.8)' }}>
            {status === 'authenticated' ? (
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 mr-3"
                    style={{ borderColor: theme === 'dark' ? '#16f2b3' : '#12c292' }}
                  >
                    {session.user.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name} 
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#16f2b3] flex items-center justify-center">
                        <span className="text-[#1a1443] font-bold">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)' }}>
                      {session.user.name}
                    </p>
                    <p className="text-xs" style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(26, 32, 44, 0.6)' }}>
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  style={{
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                    backgroundColor: 'transparent',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaUserCircle className="mr-3" size={16} />
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  style={{
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                    backgroundColor: 'transparent',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaChartBar className="mr-3" size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  style={{
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)',
                    backgroundColor: 'transparent',
                  }}
                >
                  <FaSignOutAlt className="mr-3" size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center w-full justify-center gap-2 bg-[#16f2b3] text-[#1a1443] px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 transition-colors"
              >
                <FaGoogle />
                Sign in with Google
              </button>
            )}

            {/* Mobile theme toggle */}
            <div className="flex items-center justify-between mt-4 px-3 py-3">
              <span style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)' }}>
                Theme Mode
              </span>
              <button 
                onClick={toggleTheme}
                className="flex items-center space-x-2 text-sm font-medium"
                style={{ color: theme === 'dark' ? '#16f2b3' : '#12c292' }}
              >
                {theme === 'dark' ? (
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
    </>
  );
}

export default Navbar;