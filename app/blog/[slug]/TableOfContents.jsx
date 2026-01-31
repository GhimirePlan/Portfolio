'use client';

import { useState, useEffect } from 'react';
import { BsListNested } from 'react-icons/bs';

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Parse headings from content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const headingsData = Array.from(headingElements).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
    }));

    setHeadings(headingsData);

    // Add IDs to headings in the actual content
    const contentDiv = document.querySelector('.blog-content');
    if (contentDiv) {
      const contentHeadings = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      contentHeadings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
      });
    }
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const getIndent = (level) => {
    const baseLevel = Math.min(...headings.map(h => h.level));
    return (level - baseLevel) * 0.75;
  };

  return (
    <div className="toc-sidebar">
      <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#16f2b3]/10 to-[#60A5FA]/10 border-b border-[#1d293a] hover:from-[#16f2b3]/15 hover:to-[#60A5FA]/15 transition-all"
        >
          <div className="flex items-center gap-2">
            <BsListNested className="text-[#16f2b3] text-lg" />
            <span className="font-semibold text-white text-sm">Table of Contents</span>
          </div>
          <span className="text-xs text-[#94a3b8] bg-[#1a1443] px-2 py-1 rounded-full">
            {headings.length} sections
          </span>
        </button>
        
        {/* Content */}
        <nav className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'} overflow-y-auto`}>
          <ul className="p-4 space-y-1">
            {headings.map((heading, index) => (
              <li 
                key={heading.id} 
                style={{ paddingLeft: `${getIndent(heading.level)}rem` }}
                className="relative"
              >
                <a
                  href={`#${heading.id}`}
                  className={`toc-link text-sm py-1.5 px-3 rounded-lg block transition-all duration-200 ${
                    activeId === heading.id 
                      ? 'text-[#16f2b3] bg-[#16f2b3]/10 font-medium border-l-2 border-[#16f2b3]' 
                      : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1e293b]/50'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(heading.id);
                    if (element) {
                      const yOffset = -100;
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                >
                  <span className="line-clamp-2">{heading.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Progress indicator */}
        <div className="h-1 bg-[#0f172a]">
          <div 
            className="h-full bg-gradient-to-r from-[#16f2b3] to-[#60A5FA] transition-all duration-300"
            style={{ 
              width: headings.length > 0 
                ? `${((headings.findIndex(h => h.id === activeId) + 1) / headings.length) * 100}%` 
                : '0%' 
            }}
          />
        </div>
      </div>
    </div>
  );
}