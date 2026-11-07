'use client';
export default function ErrorPage({ reset }) { return <div className="site-empty site-container"><h1>Something went wrong</h1><p>An unexpected error occurred. Please try again.</p><button type="button" className="site-button" onClick={reset}>Try again</button></div>; }
