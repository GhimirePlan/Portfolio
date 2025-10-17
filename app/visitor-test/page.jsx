'use client';

import { useEffect } from 'react';
import VisitorTracker from '../components/VisitorTracker';
import Link from 'next/link';

export default function VisitorTestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Visitor Tracking Test</h1>
      
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <p className="mb-4">
          This page demonstrates the Discord visitor alert system. When you load this page:
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Your visit is automatically tracked</li>
          <li>Your device type and browser information are detected</li>
          <li>A Discord webhook notification is sent with your visit details</li>
          <li>The status of the tracking is displayed below</li>
        </ol>
        <p>
          The notification includes your IP address, device type, browser information, 
          timestamp, and a counter of total visits.
        </p>
      </div>
      
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tracking Status</h2>
        <p className="mb-4">
          The status of your visit tracking will appear below:
        </p>
        <div className="h-16 flex items-center justify-center border border-slate-700 rounded-lg">
          {/* This component will show the tracking status */}
          <VisitorTracker showStatus={true} />
        </div>
      </div>
      
      <Link href="/" className="mt-8 text-blue-400 hover:underline">
        Return to Homepage
      </Link>
    </div>
  );
}