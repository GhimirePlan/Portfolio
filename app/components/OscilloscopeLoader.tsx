import React from 'react';

const OscilloscopeLoader: React.FC = () => {
  return (
    <div className="relative w-full h-32 flex items-center justify-center bg-gradient-to-r from-gray-900/95 to-gray-800/95 dark:from-gray-800/95 dark:to-gray-900/95 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-700/30">
      {/* Grid lines with optimized rendering */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
        {[...Array(32)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-700/10 dark:border-gray-600/10"
          />
        ))}
      </div>

      {/* Optimized background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-x" />

      {/* Enhanced oscilloscope signal */}
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="signalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="text-blue-400" stopColor="currentColor" />
            <stop offset="50%" className="text-purple-400" stopColor="currentColor" />
            <stop offset="100%" className="text-pink-400" stopColor="currentColor" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" stitchTiles="stitch" />
          </filter>
        </defs>
        <path
          d="M0,50 Q25,0 50,50 T100,50"
          fill="none"
          stroke="url(#signalGradient)"
          strokeWidth="1.5"
          filter="url(#glow)"
          className="animate-wave"
        />
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.05" />
      </svg>

      {/* Enhanced voltage indicators */}
      <div className="absolute left-2 top-2 text-xs font-mono text-blue-400/90 drop-shadow-[0_0_3px_rgba(96,165,250,0.3)]">
        +5V
      </div>
      <div className="absolute left-2 bottom-2 text-xs font-mono text-pink-400/90 drop-shadow-[0_0_3px_rgba(236,72,153,0.3)]">
        -5V
      </div>

      {/* Optimized loading text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-sm font-mono text-gray-400/90">
          <span className="inline-block animate-bounce-slow">C</span>
          <span className="inline-block animate-bounce-slow delay-75">A</span>
          <span className="inline-block animate-bounce-slow delay-150">L</span>
          <span className="inline-block animate-bounce-slow delay-225">I</span>
          <span className="inline-block animate-bounce-slow delay-300">B</span>
          <span className="inline-block animate-bounce-slow delay-375">R</span>
          <span className="inline-block animate-bounce-slow delay-450">A</span>
          <span className="inline-block animate-bounce-slow delay-525">T</span>
          <span className="inline-block animate-bounce-slow delay-600">I</span>
          <span className="inline-block animate-bounce-slow delay-675">N</span>
          <span className="inline-block animate-bounce-slow delay-750">G</span>
          <span className="inline-block animate-bounce-slow delay-825">.</span>
          <span className="inline-block animate-bounce-slow delay-900">.</span>
          <span className="inline-block animate-bounce-slow delay-975">.</span>
        </div>
      </div>

      {/* Optimized decorative elements */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 animate-gradient-x" />
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 animate-gradient-x" />
    </div>
  );
};

export default OscilloscopeLoader; 