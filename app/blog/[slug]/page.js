// @flow strict
import { personalData } from "@/utils/data/personal-data";
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BsCalendar, BsClock, BsArrowLeft, BsShare } from 'react-icons/bs';
import { timeConverter } from '@/utils/time-converter';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found | Plan Ghimire',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: `${blog.title} | Plan Ghimire`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [{ url: blog.coverImage }]
    }
  };
}

// Revalidate the page every hour
export const revalidate = 3600;

async function getBlog(slug) {
  await connectToDatabase();
  
  const blog = await Blog.findOne({ 
    slug: slug,
    published: true
  }).lean();
  
  return blog;
};

export default async function BlogDetails({ params }) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    notFound();
  }
 
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/blog" className="inline-flex items-center text-[#16f2b3] hover:text-[#60A5FA] transition-colors">
          <BsArrowLeft className="mr-2" />
          Back to all blogs
        </Link>
      </div>
      
      <article className="bg-[#1b203e] border border-[#1d293a] rounded-lg overflow-hidden shadow-xl">
        {/* Cover Image */}
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[#d3d8e8]">
            <div className="flex items-center gap-1">
              <BsCalendar />
              <span>{timeConverter(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BsClock />
              <span>{blog.readingTime} min read</span>
            </div>
          </div>
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-[#1a1443]/50 text-[#16f2b3] px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#1d293a]">
            <button 
              className="flex items-center gap-2 text-[#16f2b3] hover:text-[#60A5FA] transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
            >
              <BsShare />
              Share this article
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};