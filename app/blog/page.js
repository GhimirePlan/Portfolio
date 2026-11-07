'use client';

import { useEffect, useMemo, useState } from 'react';
import { BsSearch, BsArrowRight } from 'react-icons/bs';
import BlogCard from '../components/blog/BlogCard';
import ContactSection from '../components/homepage/contact';
import useHomeFeed from '../components/homepage/use-home-feed';
import styles from '../components/homepage/editorial.module.css';

export default function BlogPage() {
  const { items: blogs, loading, error, retry } = useHomeFeed('/api/blogs?published=true', 'blogs');
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  useEffect(() => { setSearch(new URLSearchParams(window.location.search).get('q') || ''); }, []);
  const tags = useMemo(() => [...new Set(blogs.flatMap((blog) => blog.tags || []))].sort(), [blogs]);
  const filtered = blogs.filter((blog) => (!tag || blog.tags?.includes(tag)) && `${blog.title || ''} ${blog.description || ''}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <><section className="site-blog-index site-container"><header className="site-page-heading"><p className="site-eyebrow">Writing &amp; ideas</p><h1>Blog</h1><p>Explore my thoughts, tutorials, and insights on web development, technology, and more.</p></header><div className="site-blog-filters"><div><label htmlFor="blog-search">Search articles</label><div className="site-search-field"><BsSearch aria-hidden="true" /><input id="blog-search" type="search" placeholder="Search blogs…" value={search} onChange={(event) => setSearch(event.target.value)} /></div></div><div><label htmlFor="blog-category">Category</label><select id="blog-category" value={tag} onChange={(event) => setTag(event.target.value)}><option value="">All Categories</option>{tags.map((item) => <option key={item} value={item}>{item}</option>)}</select></div></div>{loading ? <div className="site-loading" role="status">Loading articles…</div> : error ? <div className="site-empty" role="status"><h2>Articles could not be loaded</h2><button type="button" className="site-button site-button-secondary" onClick={retry}>Try again <BsArrowRight /></button></div> : filtered.length ? <><p className="site-result-count" role="status">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</p><div className={styles.articleGrid} style={{ '--post-columns': Math.min(3, filtered.length) }}>{filtered.map((blog) => <BlogCard key={blog._id || blog.slug} blog={blog} />)}</div></> : <div className="site-empty"><h2>{blogs.length ? 'No matching blog posts found' : 'No blog posts yet. Check back soon!'}</h2>{(search || tag) && <><p>Try adjusting your search or filter criteria.</p><button type="button" className="site-button site-button-secondary" onClick={() => { setSearch(''); setTag(''); }}>Clear Filters</button></>}</div>}</section><ContactSection /></>;
}
