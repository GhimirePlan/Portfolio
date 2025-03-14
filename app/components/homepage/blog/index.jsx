'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsArrowRight } from 'react-icons/bs';
import BlogCard from '../../blog/BlogCard';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs?published=true&limit=3');
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div id="blog" className="relative z-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-center my-5 lg:py-8">
          <div className="flex items-center">
            <span className="w-24 h-[2px] bg-[#1a1443]"></span>
            <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
              Latest Blog Posts
            </span>
            <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60A5FA]"></div>
          </div>
        ) : blogs && blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white rounded-md hover:from-[#34D399] hover:to-[#60A5FA] transition-all duration-300"
              >
                View All Posts <BsArrowRight className="ml-2" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}