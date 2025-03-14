'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BsArrowLeft, BsCheck, BsEye, BsImage } from 'react-icons/bs';
import dynamic from 'next/dynamic';

// Dynamically import the editor to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function PostEditor({ params }) {
  const router = useRouter();
  const { slug } = params;
  const isNewPost = slug === 'new';

  const [post, setPost] = useState({
    title: '',
    description: '',
    content: '',
    coverImage: '',
    tags: '',
    published: false
  });
  const [loading, setLoading] = useState(!isNewPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If editing an existing post, fetch its data
    if (!isNewPost) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/blogs/${slug}`);
          
          if (!res.ok) {
            throw new Error('Failed to fetch post');
          }
          
          const data = await res.json();
          setPost({
            ...data,
            tags: data.tags.join(', ')
          });
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Failed to load post. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [slug, isNewPost]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setPost(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Validate form
      if (!post.title || !post.description || !post.content || !post.coverImage) {
        throw new Error('Please fill in all required fields');
      }
      
      // Process tags
      const tags = post.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const postData = {
        ...post,
        tags
      };
      
      // Create or update post
      const url = isNewPost ? '/api/blogs' : `/api/blogs/${slug}`;
      const method = isNewPost ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save post');
      }
      
      const savedPost = await res.json();
      
      // Redirect to the post list
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      setError(error.message || 'An error occurred while saving the post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60A5FA]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link 
            href="/admin/posts" 
            className="mr-4 p-2 rounded-md bg-[#1b203e] hover:bg-[#2d3250] transition-colors"
          >
            <BsArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-white">
            {isNewPost ? 'Create New Post' : 'Edit Post'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white rounded-md hover:from-[#34D399] hover:to-[#60A5FA] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : (
            <>
              <BsCheck className="mr-2" size={20} />
              Save
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-md text-red-300">
          {error}
        </div>
      )}
      
      <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={post.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#1d293a] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#60A5FA] focus:border-[#60A5FA]"
                  placeholder="Enter post title"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={post.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#1d293a] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#60A5FA] focus:border-[#60A5FA]"
                  placeholder="Enter a brief description"
                  required
                />
              </div>
              
              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                  Content *
                </label>
                <div className="bg-[#0f172a] border border-[#1d293a] rounded-md overflow-hidden">
                  <ReactQuill
                    value={post.content}
                    onChange={handleContentChange}
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image'],
                        ['clean']
                      ],
                    }}
                    className="text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-300 mb-1">
                  Cover Image URL *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="coverImage"
                    name="coverImage"
                    value={post.coverImage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#0f172a] border border-[#1d293a] rounded-l-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#60A5FA] focus:border-[#60A5FA]"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  <div className="px-3 py-2 bg-[#2d3250] border border-[#1d293a] border-l-0 rounded-r-md flex items-center">
                    <BsImage className="text-gray-400" />
                  </div>
                </div>
                {post.coverImage && (
                  <div className="mt-2 relative h-40 rounded-md overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={post.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-[#1d293a] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#60A5FA] focus:border-[#60A5FA]"
                  placeholder="web, development, tutorial"
                />
              </div>
              
              {/* Published Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={post.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#60A5FA] bg-[#0f172a] border-[#1d293a] rounded focus:ring-[#60A5FA]"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-300">
                  Publish this post
                </label>
              </div>
              
              {/* Preview Button */}
              {!isNewPost && (
                <div className="pt-4">
                  <Link
                    href={`/blog/${slug}`}
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 bg-[#2d3250] text-white rounded-md hover:bg-[#3d4260] transition-colors w-full justify-center"
                  >
                    <BsEye className="mr-2" />
                    Preview Post
                  </Link>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 