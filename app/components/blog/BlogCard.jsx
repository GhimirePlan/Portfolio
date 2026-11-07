'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowRight, BsJournalText, BsClock } from 'react-icons/bs';
import { formatFeedDate } from '../homepage/use-home-feed';
import styles from '../homepage/editorial.module.css';

export default function BlogCard({ blog }) {
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
        <div className={styles.tags}>{(blog.tags || []).slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}{blog.tags?.length > 3 && <span>+{blog.tags.length - 3} more</span>}</div>
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
