'use client';

import Link from 'next/link';
import { BsArrowRight, BsJournalText } from 'react-icons/bs';
import useHomeFeed from '../use-home-feed';
import BlogCard from '../../blog/BlogCard';
import styles from '../editorial.module.css';

export default function Blog() {
  const { items: blogs, loading, error, retry } = useHomeFeed('/api/blogs?published=true&limit=3', 'blogs');
  return (
    <section id="blog" className={`${styles.section} ${styles.compactBlog}`} aria-labelledby="homepage-blog-heading">
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
        <div className={styles.articleGrid} style={{ '--post-columns': Math.min(3, blogs.length) }}>{blogs.slice(0, 3).map((blog) => <BlogCard key={blog._id || blog.slug} blog={blog} />)}</div>
      ) : (
        <div className={styles.empty}><BsJournalText aria-hidden="true" /><p>No blog posts yet. Check back soon!</p></div>
      )}
    </section>
  );
}
