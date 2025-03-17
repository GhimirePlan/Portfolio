'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsArrowRight, BsSearch } from 'react-icons/bs';
import { FaFilter } from 'react-icons/fa6';
import BlogCard from "../components/blog/BlogCard";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch blogs when component mounts
  useEffect(() => {
    if (isClient) {
      fetchBlogs();
    }
  }, [isClient]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blogs?published=true');
      const data = await response.json();
      
      if (response.ok) {
        setBlogs(data.blogs || []);
        
        // Extract all unique tags
        const tags = data.blogs.reduce((acc, blog) => {
          if (blog.tags && Array.isArray(blog.tags)) {
            blog.tags.forEach(tag => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
          }
          return acc;
        }, []);
        
        setAllTags(tags);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs based on search term and selected tag
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchTerm === '' || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === '' || 
      (blog.tags && blog.tags.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Blog</h1>
        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Explore my thoughts, tutorials, and insights on web development, technology, and more.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1443] border border-[#1d293a] rounded-lg py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-[#16f2b3]"
          />
          <BsSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="relative">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="appearance-none bg-[#1a1443] border border-[#1d293a] rounded-lg py-2 px-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#16f2b3]"
          >
            <option value="">All Categories</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16f2b3]"></div>
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard blog={blog} key={blog._id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1b203e] border border-[#1d293a] rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">No matching blog posts found</h3>
          <p className="text-gray-400 mb-8">Try adjusting your search or filter criteria</p>
          {searchTerm || selectedTag ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('');
              }}
              className="bg-[#16f2b3] text-[#1a1443] px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}