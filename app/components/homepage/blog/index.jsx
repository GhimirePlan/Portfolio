'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowRight, BsJournalText, BsClock } from 'react-icons/bs';
import useHomeFeed, { formatFeedDate } from '../use-home-feed';
import styles from '../editorial.module.css';

function ArticleCard({ blog }) {
  const [imageFailed, setImageFailed] = useState(false);
  const href = `/blog/${blog.slug}`;
  const date = formatFeedDate(blog.createdAt);
  return (
    <article className={styles.article}>
      <Link href={href} className={styles.cover} aria-label={`Read ${blog.title}`} tabIndex={-1}>
        {blog.coverImage && !imageFailed ? (
          <Image src={blog.coverImage} width={960} height={540} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        ) : <span className={styles.coverFallback}><BsJournalText aria-hidden="true" /></span>}
        <BsArrowRight className={styles.coverArrow} aria-hidden="true" />
      </Link>
      <div className={styles.articleBody}>
        {blog.tags?.length > 0 && <div className={styles.tags}>{blog.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}{blog.tags.length > 3 && <span>+{blog.tags.length - 3} more</span>}</div>}
        <h3><Link href={href}>{blog.title}</Link></h3>
        <p className={styles.excerpt}>{blog.description}</p>
        <div className={styles.articleMeta}>
          {date && <time dateTime={blog.createdAt}>{date}</time>}
          <span><BsClock aria-hidden="true" />{blog.readingTime || 5} min read</span>
        </div>
        <Link href={href} className={styles.readLink}>Read Article <BsArrowRight aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

export default function Blog() {
  const { items: blogs, loading, error, retry } = useHomeFeed('/api/blogs?published=true&limit=3', 'blogs');
  return (
    <section id="blog" className={styles.section} aria-labelledby="homepage-blog-heading">
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}><BsJournalText aria-hidden="true" />From the blog</p><h2 id="homepage-blog-heading">Latest Blog Posts</h2></div>
        <Link href="/blog" className={styles.outlineLink}>View All Posts <BsArrowRight aria-hidden="true" /></Link>
      </header>
      {loading ? (
        <div className={styles.articleGrid} role="status" aria-label="Loading blog posts" aria-busy="true">
          {[0, 1, 2].map((index) => <div key={index} className={styles.skeletonCard} aria-hidden="true"><span /><span /><span /></div>)}
        </div>
      ) : error ? (
        <div className={styles.empty} role="status"><BsJournalText aria-hidden="true" /><p>Blog posts could not be loaded.</p><button type="button" className={styles.outlineLink} onClick={retry}>Try again <BsArrowRight aria-hidden="true" /></button></div>
      ) : blogs.length > 0 ? (
        <div className={styles.articleGrid}>{blogs.slice(0, 3).map((blog) => <ArticleCard key={blog._id || blog.slug} blog={blog} />)}</div>
      ) : (
        <div className={styles.empty}><BsJournalText aria-hidden="true" /><p>No blog posts yet. Check back soon!</p></div>
      )}
    </section>
  );
}
