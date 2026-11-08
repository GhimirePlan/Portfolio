'use client';

import { useEffect, useState } from 'react';
import * as UAParser from 'ua-parser-js';

const VisitorTracker = ({ showStatus = false }) => {
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Use sessionStorage to prevent duplicate notifications on page reload
    let hasVisited = false;
    try { hasVisited = sessionStorage.getItem('hasVisited'); } catch { /* Storage may be disabled. */ }
    
    const trackVisit = async () => {
      try {
        // Only track if this is the first visit in this session
        if (hasVisited) {
          if (showStatus) {
            setStatus('success');
            setMessage('Already tracked in this session');
          }
          return;
        }
        
        // Mark as visited for this session
        try { sessionStorage.setItem('hasVisited', 'true'); } catch {}
        
        // Set initial loading state
        setStatus('loading');
        setMessage('Tracking visit...');
        
        // Parse user agent
        const parser = new UAParser.UAParser(window.navigator.userAgent);
        const browserResult = parser.getBrowser();
        const deviceResult = parser.getDevice();
        
        // Get device type
        let deviceType = 'Desktop';
        if (deviceResult.type === 'mobile') deviceType = 'Mobile';
        if (deviceResult.type === 'tablet') deviceType = 'Tablet';
        
        // Get browser info
        const browserInfo = `${browserResult.name || 'Unknown'} ${browserResult.version || ''}`.trim();
        
        // Get timestamp
        const os = parser.getOS();
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const query = new URLSearchParams(location.search);
        const campaign = Object.fromEntries(['source','medium','campaign'].map(key=>[key,query.get(`utm_${key}`)||'']));
        const network = connection ? [connection.effectiveType,typeof connection.downlink==='number'?`~${connection.downlink} Mbps`:null,typeof connection.rtt==='number'?`~${connection.rtt} ms RTT`:null,connection.saveData?'Data saver on':null].filter(Boolean).join(' · ') : 'Not exposed by browser';
        
        // Get current URL
        const currentUrl = window.location.origin + window.location.pathname;
        
        // Send data to API (IP will be detected server-side)
        const response = await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({

            device: deviceType,
            browser: browserInfo,
            os: [os.name,os.version].filter(Boolean).join(' '),
            model: [deviceResult.vendor,deviceResult.model].filter(Boolean).join(' '),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            languages: (navigator.languages||[navigator.language]).slice(0,4).join(', '),
            display: `${screen.width}×${screen.height} screen · ${innerWidth}×${innerHeight} viewport · ${devicePixelRatio}× scale`,
            connection: network,
            referrer: (()=>{try{const r=new URL(document.referrer);return r.origin+r.pathname}catch{return ''}})(),
            campaign,
            url: currentUrl
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setStatus('success');
        setMessage('Visit tracked successfully');
      } catch (error) {
        try { sessionStorage.removeItem('hasVisited'); } catch {}
        console.error('Error tracking visit:', error);
        setStatus('error');
        setMessage(`Error: ${error.message || 'Failed to track visit'}`);
      }
    };

    // Track visit when component mounts
    trackVisit();
  }, []);

  // Only render status message if showStatus is true
  if (!showStatus || !status) return null;

  return (
    <div className={`visitor-tracker-status ${status}`}>
      <p>{message}</p>
      <style jsx>{`
        .visitor-tracker-status {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 10px 15px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 1000;
          animation: fadeOut 8s forwards;
          max-width: 300px;
          word-break: break-word;
        }
        .success {
          background-color: #4caf50;
          color: white;
        }
        .error {
          background-color: #f44336;
          color: white;
        }
        .loading {
          background-color: #2196f3;
          color: white;
          animation: pulse 1.5s infinite;
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default VisitorTracker;