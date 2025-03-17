'use client';

import { useEffect } from 'react';

export default function ForceNavbar() {
  useEffect(() => {
    function forceNavbarVisibility() {
      // Try to find the navbar using various selectors
      const navbar = document.getElementById('navbar-root');
      
      if (navbar) {
        // Force the navbar to be visible with important styles
        navbar.style.display = 'block';
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.right = '0';
        navbar.style.width = '100%';
        navbar.style.zIndex = '9999';
        navbar.style.backgroundColor = '#141b2d';
        navbar.style.borderBottom = '4px solid #16f2b3';
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
        navbar.style.visibility = 'visible';
        navbar.style.opacity = '1';
        
        // Ensure body has padding to account for the navbar
        document.body.style.paddingTop = '80px';
        document.body.style.marginTop = '0';
        
        console.log('Navbar visibility enforced by ForceNavbar component');
      }
    }
    
    // Run immediately
    forceNavbarVisibility();
    
    // Run on window load
    window.addEventListener('load', forceNavbarVisibility);
    
    // Check every second to ensure navbar remains visible
    const interval = setInterval(forceNavbarVisibility, 1000);
    
    // Clean up
    return () => {
      window.removeEventListener('load', forceNavbarVisibility);
      clearInterval(interval);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}