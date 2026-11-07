'use client';

import { useMemo, useState } from 'react';
import { BsLinkedin, BsChevronLeft, BsChevronRight, BsStarFill, BsArrowUpRight, BsArrowRight } from 'react-icons/bs';
import { personalData } from '@/utils/data/personal-data';
import useHomeFeed, { formatFeedDate } from './use-home-feed';
import styles from './editorial.module.css';

// Only send valid LinkedIn URLs to LinkedIn's embed endpoint.
function getLinkedInUrls(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !(url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com'))) return null;
    const path = decodeURIComponent(url.pathname);
    const urn = path.match(/urn:li:(activity|ugcPost|share):(\d+)/);
    const activity = path.match(/(activity|ugcPost)-(\d+)/);
    const match = urn || activity;
    const embed = match
      ? `https://www.linkedin.com/embed/feed/update/urn:li:${match[1]}:${match[2]}?collapsed=1`
      : `https://www.linkedin.com/embed/feed/update?url=${encodeURIComponent(url.href)}&collapsed=1`;
    return { original: url.href, embed };
  } catch {
    return null;
  }
}

export default function LinkedInSection() {
  const { items, loading, error, retry } = useHomeFeed('/api/linkedin-posts');
  const [currentIndex, setCurrentIndex] = useState(0);
  const posts = useMemo(() => items.map((post) => ({ ...post, urls: getLinkedInUrls(post.url) }))
    .filter((post) => post.urls)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0)), [items]);
  const index = posts.length ? currentIndex % posts.length : 0;
  const selected = posts[index];
  const changePost = (offset) => setCurrentIndex((current) => (current + offset + posts.length) % posts.length);
  const postLabel = (post, number) => `${post.tag || 'other'} · ${formatFeedDate(post.createdAt) || `Post ${number + 1}`}`;

  return (
    <section id="linkedin" className={styles.section} aria-labelledby="homepage-linkedin-heading">
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}><BsLinkedin aria-hidden="true" />Beyond the blog</p><h2 id="homepage-linkedin-heading">LinkedIn Spotlights</h2></div>
        <a href={personalData.linkedIn} target="_blank" rel="noopener noreferrer" className={styles.outlineLink}>View LinkedIn <BsArrowUpRight aria-hidden="true" /></a>
      </header>
      {loading ? (
        <div className={styles.feedSkeleton} role="status" aria-label="Loading LinkedIn posts" aria-busy="true"><span className={styles.skeletonCard} aria-hidden="true" /></div>
      ) : error ? (
        <div className={styles.empty} role="status"><BsLinkedin aria-hidden="true" /><p>LinkedIn posts could not be loaded.</p><button type="button" className={styles.outlineLink} onClick={retry}>Try again <BsArrowRight aria-hidden="true" /></button></div>
      ) : !selected ? (
        <div className={styles.empty}><BsLinkedin aria-hidden="true" /><p>No LinkedIn posts yet. Check back soon!</p><a href={personalData.linkedIn} target="_blank" rel="noopener noreferrer" className={styles.readLink}>Connect on LinkedIn <BsArrowUpRight aria-hidden="true" /></a></div>
      ) : (
        <div className={styles.linkedinLayout}>
          <aside className={styles.linkedinSidebar} aria-label="LinkedIn posts">
            <div className={styles.profile}><span className={styles.linkedinIcon}><BsLinkedin aria-hidden="true" /></span><div><strong>{personalData.name}</strong><a href={personalData.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn <BsArrowUpRight aria-hidden="true" /></a></div></div>
            <div className={styles.postList}>
              {posts.map((post, number) => <button key={post._id || post.url} type="button" aria-pressed={number === index} aria-controls="linkedin-post" onClick={() => setCurrentIndex(number)} className={`${styles.postButton} ${number === index ? styles.activePost : ''}`}><span className={styles.postNumber}>{String(number + 1).padStart(2, '0')}</span><span><span className={styles.postTag}>{post.tag || 'other'}</span><span className={styles.postDate}>{formatFeedDate(post.createdAt)}</span></span>{post.featured ? <BsStarFill className={styles.featuredStar} aria-label="Featured" /> : <BsArrowUpRight aria-hidden="true" />}</button>)}
            </div>
          </aside>
          <div id="linkedin-post" className={styles.linkedinPanel}>
            <div className={styles.embedHeader}><span>{selected.featured ? <><BsStarFill aria-hidden="true" /> Featured</> : <><BsLinkedin aria-hidden="true" /> LinkedIn</>}</span><a href={selected.urls.original} target="_blank" rel="noopener noreferrer">Open post <BsArrowUpRight aria-hidden="true" /></a></div>
            <div className={styles.embedFrame}><iframe key={selected.urls.embed} src={selected.urls.embed} width="504" height="627" loading="lazy" title={`LinkedIn post: ${postLabel(selected, index)}`} allowFullScreen /></div>
            <footer className={styles.postControls}><span aria-live="polite" aria-atomic="true">Post {index + 1} of {posts.length}</span>{posts.length > 1 && <div><button type="button" onClick={() => changePost(-1)} aria-label="Previous LinkedIn post"><BsChevronLeft aria-hidden="true" /></button><button type="button" onClick={() => changePost(1)} aria-label="Next LinkedIn post"><BsChevronRight aria-hidden="true" /></button></div>}</footer>
          </div>
        </div>
      )}
    </section>
  );
}
