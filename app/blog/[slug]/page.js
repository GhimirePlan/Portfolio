import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BsCalendar, BsClock, BsArrowLeft, BsEye, BsPersonCircle, BsBookmark } from 'react-icons/bs';
import { timeConverter } from '@/utils/time-converter';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import ClientWrapper from './ClientWrapper';
import ReadingProgress from './ReadingProgress';
import ScrollToTop from './ScrollToTop';
import TableOfContents from './TableOfContents';

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
      images: blog.coverImage ? [{ url: blog.coverImage }] : []
    }
  };
}

// Revalidate the page every hour
export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export const viewport = {
  themeColor: "#16f2b3",
  width: "device-width",
  initialScale: 1,
};

async function getBlog(slug) {
  try {
    if (!process.env.MONGODB_URI) {
      return null;
    }
    await connectToDatabase();
    
    const blog = await Blog.findOne({ 
      slug: slug,
      published: true
    }).lean();
    
    return blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Sanitize HTML with extended options for blog content
function sanitizeBlogContent(content) {
  return sanitizeHtml(content || '', {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'strong', 'em', 'b', 'i', 'u', 's', 'strike',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div', 'mark', 'abbr', 'cite',
      'dl', 'dt', 'dd', 'kbd', 'sub', 'sup',
      'iframe'
    ],
    allowedAttributes: {
      '*': ['style', 'class', 'className', 'id'],
      'a': ['href', 'target', 'rel', 'title'],
      'img': ['src', 'alt', 'width', 'height', 'loading'],
      'abbr': ['title'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com', 'www.vimeo.com']
  });
}

export default async function BlogDetails({ params }) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    notFound();
  }

  const sanitizedContent = sanitizeBlogContent(blog.content);
  const wordCount = blog.content ? blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
 
  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgress />
      
      <div className="min-h-screen">
        {/* Hero Section with Cover Image */}
        <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px]">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/50 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f172a]/80 backdrop-blur-sm text-[#16f2b3] hover:text-white hover:bg-[#16f2b3] rounded-full transition-all duration-300 border border-[#16f2b3]/30"
            >
              <BsArrowLeft />
              <span className="text-sm font-medium">All Posts</span>
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Article Column */}
            <article className="lg:col-span-8 xl:col-span-8">
              {/* Article Header Card */}
              <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-2xl overflow-hidden shadow-2xl mb-8">
                <div className="p-6 md:p-10">
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center gap-1 text-xs font-medium bg-gradient-to-r from-[#16f2b3]/10 to-[#60A5FA]/10 text-[#16f2b3] px-3 py-1.5 rounded-full border border-[#16f2b3]/20 hover:border-[#16f2b3]/40 transition-colors"
                        >
                          <BsBookmark className="text-[10px]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                    {blog.title}
                  </h1>
                  
                  {/* Description */}
                  {blog.description && (
                    <p className="text-lg text-[#94a3b8] mb-8 leading-relaxed border-l-4 border-[#16f2b3]/30 pl-4">
                      {blog.description}
                    </p>
                  )}
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#1d293a]">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#16f2b3] to-[#60A5FA] flex items-center justify-center">
                        <BsPersonCircle className="text-white text-2xl" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Plan Ghimire</p>
                        <p className="text-xs text-[#94a3b8]">Author</p>
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="hidden sm:block w-px h-10 bg-[#1d293a]" />
                    
                    {/* Date */}
                    <div className="flex items-center gap-2 text-[#94a3b8]">
                      <BsCalendar className="text-[#16f2b3]" />
                      <span className="text-sm">{timeConverter(blog.createdAt)}</span>
                    </div>
                    
                    {/* Reading Time */}
                    <div className="flex items-center gap-2 text-[#94a3b8]">
                      <BsClock className="text-[#60A5FA]" />
                      <span className="text-sm">{blog.readingTime || Math.ceil(wordCount / 200)} min read</span>
                    </div>
                    
                    {/* Word Count */}
                    <div className="flex items-center gap-2 text-[#94a3b8]">
                      <BsEye className="text-[#a78bfa]" />
                      <span className="text-sm">{wordCount.toLocaleString()} words</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 md:p-10 lg:p-12">
                  <div 
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
                  />
                </div>
              </div>
            </article>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 xl:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <TableOfContents content={blog.content || ''} />
                
                {/* Quick Stats Card */}
                <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16f2b3]"></span>
                    Quick Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-[#1d293a]/50">
                      <span className="text-sm text-[#94a3b8]">Published</span>
                      <span className="text-sm text-white font-medium">{timeConverter(blog.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#1d293a]/50">
                      <span className="text-sm text-[#94a3b8]">Reading time</span>
                      <span className="text-sm text-white font-medium">{blog.readingTime || Math.ceil(wordCount / 200)} min</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-[#94a3b8]">Word count</span>
                      <span className="text-sm text-white font-medium">{wordCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Author Card */}
                <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#16f2b3] to-[#60A5FA] flex items-center justify-center shadow-lg shadow-[#16f2b3]/20">
                      <BsPersonCircle className="text-white text-3xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Plan Ghimire</h3>
                      <p className="text-sm text-[#94a3b8]">Developer & Writer</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">
                    Passionate about technology and sharing knowledge through writing. Building modern web experiences.
                  </p>
                  <Link 
                    href="/"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-[#16f2b3] hover:text-[#60A5FA] transition-colors"
                  >
                    View Portfolio
                    <BsArrowLeft className="rotate-180" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Client Components (Share & Comments) */}
          <div className="lg:col-span-8 xl:col-span-8 max-w-4xl">
            <ClientWrapper blogSlug={params.slug} />
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}