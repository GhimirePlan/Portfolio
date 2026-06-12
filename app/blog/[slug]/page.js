import Image from 'next/image';
import sanitizeHtml from 'sanitize-html';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  BsCalendar, 
  BsClock, 
  BsArrowLeft, 
  BsEye, 
  BsPersonCircle, 
  BsBookmark, 
  BsLink45Deg, 
  BsFileEarmarkText,
  BsFilePdf,
  BsPlayCircle,
  BsYoutube
} from 'react-icons/bs';
import { SiGoogledrive } from 'react-icons/si';
import { timeConverter } from '@/utils/time-converter';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import ClientWrapper from './ClientWrapper';
import ReadingProgress from './ReadingProgress';
import ScrollToTop from './ScrollToTop';
import TableOfContents from './TableOfContents';
import BlogAnimate from './BlogAnimate';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found | Sajesan Ghimire',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: `${blog.title} | Sajesan Ghimire`,
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

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

async function getRelatedBlogs(tags, currentId) {
  try {
    if (!process.env.MONGODB_URI || !tags || tags.length === 0) {
      return [];
    }
    await connectToDatabase();
    
    const relatedBlogs = await Blog.find({
      _id: { $ne: currentId },
      published: true,
      tags: { $in: tags }
    })
    .limit(3)
    .lean();
    
    return JSON.parse(JSON.stringify(relatedBlogs));
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
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

  const relatedBlogs = await getRelatedBlogs(blog.tags, blog._id);
  const sanitizedContent = sanitizeBlogContent(blog.content);
  const wordCount = blog.content ? blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const youtubeVideoId = getYouTubeId(blog.youtubeVideo);

  const getEmbedUrl = (url) => {
    try {
      if (url.includes('drive.google.com')) {
        return url.replace('/view', '/preview').replace('/edit', '/preview');
      }
      if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes('vimeo.com/')) {
        const id = url.split('vimeo.com/')[1].split('?')[0];
        return `https://player.vimeo.com/video/${id}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  // Split content to insert video before the first heading or at the beginning
  const getContentParts = () => {
    if (!youtubeVideoId) {
      return { before: sanitizedContent, after: null };
    }

    // Try to find the first h2 or h3 heading to insert before
    const targetHeadings = ['<h2', '<h3'];
    let insertIndex = -1;
    
    for (const heading of targetHeadings) {
      const index = sanitizedContent.indexOf(heading);
      if (index !== -1 && (insertIndex === -1 || index < insertIndex)) {
        insertIndex = index;
      }
    }
    
    if (insertIndex === -1) {
      // If no heading found, insert after the first paragraph or at beginning
      const firstParaEnd = sanitizedContent.indexOf('</p>');
      insertIndex = firstParaEnd !== -1 ? firstParaEnd + 4 : 0;
    }

    return {
      before: sanitizedContent.substring(0, insertIndex),
      after: sanitizedContent.substring(insertIndex)
    };
  };

  const { before, after } = getContentParts();

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
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                    {blog.title}
                  </h1>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#1d293a]">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#16f2b3] to-[#60A5FA] p-0.5 overflow-hidden">
                        <div className="w-full h-full rounded-full bg-[#0d1224] flex items-center justify-center overflow-hidden">
                          <Image
                            src="/favicon.jpg"
                            alt="Plan Ghimire"
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
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
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-2xl overflow-hidden shadow-xl mb-8">
                <div className="p-4 sm:p-6 md:p-10 lg:p-12">
                  <BlogAnimate>
                    <div className="blog-content">
                      <div dangerouslySetInnerHTML={{ __html: before }} />
                      
                      {after && youtubeVideoId && (
                        <>
                          <div className="my-12 sm:my-16 -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 animate-scale-in animation-delay-300">
                            <div className="px-4 sm:px-6 md:px-10 lg:px-12 mb-4 sm:mb-6 flex items-center gap-2">
                              <span className="w-2 h-6 bg-gradient-to-b from-[#16f2b3] to-[#60A5FA] rounded-full"></span>
                              <h4 className="text-xl sm:text-2xl font-bold text-white">Project Video Demo</h4>
                            </div>
                            <div className="relative w-full">
                              <div className="relative w-full pb-[56.25%] sm:rounded-xl md:rounded-2xl overflow-hidden border border-[#1d293a] shadow-xl sm:shadow-2xl bg-[#0d1224]">
                                <iframe
                                  src={`https://www.youtube.com/embed/${youtubeVideoId}?controls=1&modestbranding=1&rel=0`}
                                  className="absolute inset-0 w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  loading="lazy"
                                  title="Video Demo"
                                />
                              </div>
                            </div>
                          </div>
                          <div dangerouslySetInnerHTML={{ __html: after }} />
                        </>
                      )}
                      
                      {!after && <div dangerouslySetInnerHTML={{ __html: before }} />}
                    </div>
                  </BlogAnimate>
                </div>
              </div>

              {/* Related Documents Section */}
              {blog.relatedDocs && blog.relatedDocs.length > 0 && (
                <div className="space-y-8 mb-8">
                  <div className="p-8 bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <BsFileEarmarkText className="text-[#16f2b3]" />
                      Related Documents
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {blog.relatedDocs.map((doc, index) => {
                        const url = doc.url.toLowerCase();
                        let Icon = BsLink45Deg;
                        let typeLabel = 'Link';

                        if (url.includes('drive.google.com')) {
                          Icon = SiGoogledrive;
                          typeLabel = 'Google Drive';
                        } else if (url.endsWith('.pdf')) {
                          Icon = BsFilePdf;
                          typeLabel = 'PDF Document';
                        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                          Icon = BsYoutube;
                          typeLabel = 'YouTube Video';
                        } else if (url.includes('vimeo.com')) {
                          Icon = BsPlayCircle;
                          typeLabel = 'Vimeo Video';
                        } else if (url.match(/\.(mp4|webm|ogg)$/)) {
                          Icon = BsPlayCircle;
                          typeLabel = 'Video File';
                        }

                        return (
                          <a 
                            key={index}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 bg-[#1a1443]/50 border border-[#1d293a] rounded-xl hover:border-[#16f2b3]/50 transition-all group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-[#0d1224] flex items-center justify-center text-[#16f2b3] group-hover:scale-110 transition-transform">
                              <Icon className="text-2xl" />
                            </div>
                            <div>
                              <p className="text-white font-medium group-hover:text-[#16f2b3] transition-colors line-clamp-1">{doc.name}</p>
                              <p className="text-xs text-gray-400">{typeLabel}</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Embedded Views */}
                  {blog.relatedDocs.filter(doc => doc.embed).map((doc, index) => (
                    <div key={`embed-${index}`} className="space-y-4">
                      <div className="flex items-center gap-2 px-2">
                        <span className="w-2 h-6 bg-[#16f2b3] rounded-full"></span>
                        <h4 className="text-lg font-bold text-white">{doc.name} (Preview)</h4>
                      </div>
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#1d293a] bg-[#0d1224] shadow-2xl">
                        <iframe
                          src={getEmbedUrl(doc.url)}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          loading="lazy"
                          title={doc.name}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comments & Sharing */}
              <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-2xl p-6 md:p-10 shadow-xl">
                <ClientWrapper blogSlug={params.slug} />
              </div>
            </article>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <TableOfContents content={blog.content || ''} />
                
                {/* Author Card */}
                <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#16f2b3] to-[#60A5FA] p-0.5 shadow-lg shadow-[#16f2b3]/20 overflow-hidden">
                      <div className="w-full h-full rounded-full bg-[#0d1224] flex items-center justify-center overflow-hidden">
                        <Image
                          src="/favicon.jpg"
                          alt="Plan Ghimire"
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Plan Ghimire</h3>
                      <p className="text-sm text-[#94a3b8]">Author</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">
                    ECE Student | Aspiring AI & Web Developer
                  </p>
                  <Link 
                    href="/"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-[#16f2b3] hover:text-[#60A5FA] transition-colors"
                  >
                    View Portfolio
                    <BsArrowLeft className="rotate-180" />
                  </Link>
                </div>

                {/* Related Posts Sidebar */}
                {relatedBlogs.length > 0 && (
                  <div className="bg-gradient-to-br from-[#1b203e] to-[#0f172a] border border-[#1d293a] rounded-xl p-6 shadow-lg">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#16f2b3]"></span>
                      Related Posts
                    </h3>
                    <div className="space-y-4">
                      {relatedBlogs.map((rBlog) => (
                        <Link 
                          href={`/blog/${rBlog.slug}`} 
                          key={rBlog._id}
                          className="flex gap-4 group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <Image
                              src={rBlog.coverImage}
                              alt={rBlog.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-xs font-bold text-white group-hover:text-[#16f2b3] transition-colors line-clamp-2 leading-snug">
                              {rBlog.title}
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {timeConverter(rBlog.createdAt)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}
