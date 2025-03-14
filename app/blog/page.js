// @flow strict

import Link from 'next/link';
import { BsArrowRight } from 'react-icons/bs';
import BlogCard from "../components/blog/BlogCard";
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const metadata = {
  title: 'Blog | Plan Ghimire',
  description: 'Read the latest articles from Plan Ghimire on web development, technology, and more.',
};

// Revalidate the page every hour
export const revalidate = 3600;

async function getBlogs() {
  await connectToDatabase();
  
  // Only fetch published blogs
  const blogs = await Blog.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(9)
    .lean();
  
  return blogs;
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All Blogs
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
          {blogs.map((blog) => (
            <BlogCard blog={blog} key={blog._id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">No blog posts yet</h3>
          <p className="text-gray-400 mb-8">Check back soon for new content!</p>
        </div>
      )}
    </div>
  );
};