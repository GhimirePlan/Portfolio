'use client';

import { timeConverter } from '@/utils/time-converter';
import Image from 'next/image';
import Link from 'next/link';
import { BsCalendar, BsClock, BsArrowRight, BsTag } from 'react-icons/bs';

export default function BlogCard({ blog }) {
  return (
    <div className="border border-[#1d293a] hover:border-[#16f2b3] transition-all duration-300 bg-[#1b203e] rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#16f2b3]/10 group">
      <div className="h-48 lg:h-56 w-auto cursor-pointer overflow-hidden relative">
        <Link href={`/blog/${blog.slug}`}>
          <Image
            src={blog.coverImage}
            height={1080}
            width={1920}
            alt={blog.title}
            className='h-full w-full object-cover group-hover:scale-110 transition-all duration-500 ease-in-out'
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b203e] to-transparent opacity-60"></div>
        </Link>
      </div>
      
      <div className="p-4 sm:p-5 flex flex-col">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-[#1a1443] text-[#16f2b3] px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs bg-[#1a1443] text-gray-400 px-2 py-1 rounded-full">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <Link href={`/blog/${blog.slug}`}>
          <h3 className='mb-3 cursor-pointer text-xl text-white font-semibold group-hover:text-[#16f2b3] transition-colors duration-300 line-clamp-2'>
            {blog.title}
          </h3>
        </Link>
        
        <p className='text-sm text-gray-300 pb-4 line-clamp-3'>
          {blog.description}
        </p>
        
        <div className="flex justify-between items-center text-gray-400 text-sm mt-auto">
          <div className="flex items-center gap-2">
            <BsCalendar />
            <p>{timeConverter(blog.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1">
            <BsClock />
            <span>{blog.readingTime || 5} min read</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-[#1d293a]">
          <Link 
            href={`/blog/${blog.slug}`}
            className="flex items-center text-[#16f2b3] hover:text-[#60A5FA] transition-colors group-hover:translate-x-1 duration-300"
          >
            <span className="font-medium">Read Article</span>
            <BsArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
} 