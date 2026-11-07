'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackAnalytics, projectLink } from '@/utils/analytics-client';

export default function AnalyticsTracker() {
  const pathname = usePathname(); const previous = useRef(null);
  useEffect(() => {
    if (/^\/(admin|visitor-test)(\/|$)/.test(pathname)) return;
    if (previous.current !== pathname) { previous.current = pathname; trackAnalytics('page_view'); }
    const click = event => {
      const link = event.target.closest?.('a[href]');
      if (!link || event.defaultPrevented || (event.type === 'auxclick' && event.button !== 1)) return;
      if (link.dataset.analytics === 'resume') trackAnalytics('resume_click');
      else { const resource = projectLink(link.href); if (resource) trackAnalytics('project_open', { resource }); }
    };
    document.addEventListener('click', click); document.addEventListener('auxclick', click);
    return () => { document.removeEventListener('click', click); document.removeEventListener('auxclick', click); };
  }, [pathname]);
  return null;
}
