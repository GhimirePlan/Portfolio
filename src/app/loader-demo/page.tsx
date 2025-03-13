'use client';

import React, { useState } from 'react';
import OscilloscopeLoader from '../../components/OscilloscopeLoader';

export default function LoaderDemo() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Oscilloscope Loader Demo
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Default Size
            </h2>
            <OscilloscopeLoader />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Larger Size
            </h2>
            <div className="h-64">
              <OscilloscopeLoader />
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Features
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Smooth sine wave animation with voltage indicators</li>
            <li>• Responsive grid background simulating oscilloscope display</li>
            <li>• Neon-like glow effect using SVG filters</li>
            <li>• Dark and light mode support</li>
            <li>• Fully responsive design</li>
            <li>• Optimized performance using CSS transforms</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 