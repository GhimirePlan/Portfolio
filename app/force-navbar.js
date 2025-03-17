'use client';

import { useEffect } from 'react';

export default function ForceNavbar() {
  useEffect(() => {
    // Function to ensure navbar is visible
    function ensureNavbarVisible() {
      const navbar = document.querySelector('.fixed-navbar');
      if (navbar) {
        navbar.style.display = 'block';
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.right = '0';
        navbar.style.width = '100%';
        navbar.style.zIndex = '9999';
      }
    }

    // Run immediately
    ensureNavbarVisible();

    // Run on window resize
    window.addEventListener('resize', ensureNavbarVisible);

    // Run every second to ensure it's always visible
    const interval = setInterval(ensureNavbarVisible, 1000);

    return () => {
      window.removeEventListener('resize', ensureNavbarVisible);
      clearInterval(interval);
    };
  }, []);

  return null;
} 