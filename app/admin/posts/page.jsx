'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BsPlus, 
  BsPencil, 
  BsTrash, 
  BsEye, 
  BsEyeSlash,
  BsSearch,
  BsChevronLeft,
  BsChevronRight
} from 'react-icons/bs';

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft'
  
  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/blogs?page=${page}&limit=10`;
      
      if (filter === 'published') {
        url += '&published=true';
      } else if (filter === 'draft') {
        url += '&published=false';
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      setPosts(data.blogs);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, filter]);
  
  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Refresh the posts list
        fetchPosts(currentPage);
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to delete post'}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post');
    }
  };
  
  const handleTogglePublish = async (post) => {
    try {
      const res = await fetch(`/api/blogs/${post.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !post.published,
        }),
      });
      
      if (res.ok) {
        // Refresh the posts list
        fetchPosts(currentPage);
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to update post'}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post');
    }
  };
  
  const filteredPosts = posts.filter(post => {
    // Filter by status
    if (filter === 'published' && !post.published) return false;
    if (filter === 'draft' && post.published) return false;
    
    // Search by title or description
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(term) || 
        post.description.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 mt-2">
            Manage your blog posts
          </p>
        </div>
        <Link 
          href="/admin/posts/new"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white rounded-md hover:from-[#34D399] hover:to-[#60A5FA] transition-all duration-300"
        >
          <BsPlus className="mr-1" /> New Post
        </Link>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'all' 
                ? 'bg-[#60A5FA] text-white' 
                : 'bg-[#2d3250] text-gray-300 hover:bg-[#3d4260]'
            } transition-colors`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'published' 
                ? 'bg-[#34D399] text-white' 
                : 'bg-[#2d3250] text-gray-300 hover:bg-[#3d4260]'
            } transition-colors`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'draft' 
                ? 'bg-[#F87171] text-white' 
                : 'bg-[#2d3250] text-gray-300 hover:bg-[#3d4260]'
            } transition-colors`}
          >
            Drafts
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BsSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 bg-[#0f172a] border border-[#1d293a] rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#60A5FA] focus:border-[#60A5FA]"
          />
        </div>
      </div>
      
      {/* Posts Table */}
      <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60A5FA]"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#1d293a]">
              <thead className="bg-[#2d3250]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1d293a]">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-[#2d3250]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-400 line-clamp-1 md:hidden">
                            {post.published ? 'Published' : 'Draft'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.published 
                          ? 'bg-[#34D399]/20 text-[#34D399]' 
                          : 'bg-[#F87171]/20 text-[#F87171]'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden md:table-cell">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className={`p-1.5 rounded-md ${
                            post.published 
                              ? 'bg-[#F87171]/10 text-[#F87171] hover:bg-[#F87171]/20' 
                              : 'bg-[#34D399]/10 text-[#34D399] hover:bg-[#34D399]/20'
                          } transition-colors`}
                          title={post.published ? 'Unpublish' : 'Publish'}
                        >
                          {post.published ? <BsEyeSlash /> : <BsEye />}
                        </button>
                        <Link
                          href={`/admin/posts/${post.slug}`}
                          className="p-1.5 rounded-md bg-[#60A5FA]/10 text-[#60A5FA] hover:bg-[#60A5FA]/20 transition-colors"
                          title="Edit"
                        >
                          <BsPencil />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="p-1.5 rounded-md bg-[#F87171]/10 text-[#F87171] hover:bg-[#F87171]/20 transition-colors"
                          title="Delete"
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-400">No posts found</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-2 text-[#16f2b3] hover:text-[#60A5FA] transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-[#1d293a]">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-[#2d3250]/50 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2d3250] text-white hover:bg-[#3d4260]'
                } transition-colors`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-[#2d3250]/50 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2d3250] text-white hover:bg-[#3d4260]'
                } transition-colors`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      currentPage === 1
                        ? 'border-[#1d293a] bg-[#2d3250]/50 text-gray-500 cursor-not-allowed'
                        : 'border-[#1d293a] bg-[#2d3250] text-gray-400 hover:bg-[#3d4260] hover:text-white'
                    } transition-colors`}
                  >
                    <span className="sr-only">Previous</span>
                    <BsChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === i + 1
                          ? 'z-10 bg-[#60A5FA]/20 border-[#60A5FA]/50 text-[#60A5FA]'
                          : 'border-[#1d293a] bg-[#2d3250] text-gray-400 hover:bg-[#3d4260] hover:text-white'
                      } transition-colors`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      currentPage === totalPages
                        ? 'border-[#1d293a] bg-[#2d3250]/50 text-gray-500 cursor-not-allowed'
                        : 'border-[#1d293a] bg-[#2d3250] text-gray-400 hover:bg-[#3d4260] hover:text-white'
                    } transition-colors`}
                  >
                    <span className="sr-only">Next</span>
                    <BsChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 