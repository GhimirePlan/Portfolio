'use client';

import { timeConverter } from '@/utils/time-converter';
import Image from 'next/image';
import Link from 'next/link';
import { BsCalendar, BsClock } from 'react-icons/bs';

export default function BlogCard({ blog }) {
  return (
    <div className="border border-[#1d293a] hover:border-[#464c6a] transition-all duration-500 bg-[#1b203e] rounded-lg relative group">
      <div className="h-44 lg:h-52 w-auto cursor-pointer overflow-hidden rounded-t-lg">
        <Link href={`/blog/${blog.slug}`}>
          <Image
            src={blog.coverImage}
            height={1080}
            width={1920}
            alt={blog.title}
            className='h-full w-full object-cover group-hover:scale-110 transition-all duration-300'
          />
        </Link>
      </div>
      <div className="p-2 sm:p-3 flex flex-col">
        <div className="flex justify-between items-center text-[#16f2b3] text-sm">
          <div className="flex items-center gap-2">
            <BsCalendar />
            <p>{timeConverter(blog.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1">
            <BsClock />
            <span>{blog.readingTime} min read</span>
          </div>
        </div>
        <Link href={`/blog/${blog.slug}`}>
          <h3 className='my-2 lg:my-3 cursor-pointer text-lg text-white sm:text-xl font-medium hover:text-[#16f2b3] transition-colors duration-300'>
            {blog.title}
          </h3>
        </Link>
        <p className='text-sm lg:text-base text-[#d3d8e8] pb-3 lg:pb-6 line-clamp-3'>
          {blog.description}
        </p>
        <div className="mb-3">
          <Link href={`/blog/${blog.slug}`}>
            <button className='bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white px-4 py-1.5 rounded-full text-xs hover:shadow-lg hover:shadow-[#60A5FA]/20 transition-all duration-300'>
              Read More
            </button>
          </Link>
        </div>
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-[#1a1443]/50 text-[#16f2b3] px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 