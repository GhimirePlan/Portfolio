import React from 'react';

const OscilloscopeLoader: React.FC = () => {
  return (
    <div className="relative w-full h-32 flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-xl overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
        {[...Array(32)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-700/30 dark:border-gray-600/30"
          />
        ))}
      </div>

      {/* Oscilloscope signal */}
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="signalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="text-blue-400" stopColor="currentColor" />
            <stop offset="100%" className="text-purple-400" stopColor="currentColor" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M0,50 Q25,0 50,50 T100,50"
          fill="none"
          stroke="url(#signalGradient)"
          strokeWidth="2"
          filter="url(#glow)"
          className="animate-wave"
        />
      </svg>

      {/* Voltage indicators */}
      <div className="absolute left-2 top-2 text-xs font-mono text-gray-400">
        +5V
      </div>
      <div className="absolute left-2 bottom-2 text-xs font-mono text-gray-400">
        -5V
      </div>

      {/* Loading text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-mono text-gray-400 animate-pulse">
        CALIBRATING...
      </div>
    </div>
  );
};

export default OscilloscopeLoader; 