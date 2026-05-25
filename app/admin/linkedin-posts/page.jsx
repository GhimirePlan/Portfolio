'use client';

import { useState, useEffect } from 'react';
import { 
  BsPlus, 
  BsPencil, 
  BsTrash, 
  BsStar, 
  BsStarFill,
  BsLink45Deg,
  BsX
} from 'react-icons/bs';

export default function LinkedInPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    url: '',
    tag: 'tech',
    featured: false
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/linkedin-posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = (post = null) => {
    if (post) {
      setCurrentPost(post);
      setFormData({
        url: post.url,
        tag: post.tag,
        featured: post.featured
      });
    } else {
      setCurrentPost(null);
      setFormData({
        url: '',
        tag: 'tech',
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPost(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = currentPost ? 'PUT' : 'POST';
    const url = currentPost ? `/api/linkedin-posts/${currentPost._id}` : '/api/linkedin-posts';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchPosts();
        handleCloseModal();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to save post'}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('An error occurred while saving the post');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this LinkedIn post?')) return;

    try {
      const res = await fetch(`/api/linkedin-posts/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleToggleFeatured = async (post) => {
    try {
      const res = await fetch(`/api/linkedin-posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !post.featured })
      });

      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  return (
    <div className="p-6 text-white w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">LinkedIn Embed Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#16f2b3] text-[#0f172a] px-4 py-2 rounded-md font-bold hover:bg-[#12c292] transition-colors"
        >
          <BsPlus size={20} /> Add New URL
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60A5FA]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div 
              key={post._id} 
              className={`bg-[#1b203e] rounded-xl p-5 border ${post.featured ? 'border-[#0A66C2]' : 'border-[#1d293a]'} hover:border-[#0A66C2] transition-all relative group`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="bg-[#0A66C2]/10 text-[#0A66C2] text-xs px-2 py-1 rounded-full font-medium uppercase">
                  {post.tag}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggleFeatured(post)}
                    className={`p-1.5 rounded-md ${post.featured ? 'text-yellow-400' : 'text-gray-400'} hover:bg-gray-700`}
                    title={post.featured ? 'Unmark Featured' : 'Mark as Featured'}
                  >
                    {post.featured ? <BsStarFill /> : <BsStar />}
                  </button>
                  <button 
                    onClick={() => handleOpenModal(post)}
                    className="p-1.5 rounded-md text-blue-400 hover:bg-gray-700"
                    title="Edit"
                  >
                    <BsPencil />
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)}
                    className="p-1.5 rounded-md text-red-400 hover:bg-gray-700"
                    title="Delete"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 break-all line-clamp-2">{post.url}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <a 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-1 text-[#0A66C2] hover:underline text-sm font-medium"
              >
                <BsLink45Deg /> Open Original Post
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1b203e] border border-[#1d293a] rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-[#1d293a]">
              <h2 className="text-xl font-bold">{currentPost ? 'Edit LinkedIn URL' : 'Add LinkedIn URL'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <BsX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn Post URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full bg-[#0f172a] border border-[#1d293a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0A66C2]"
                  placeholder="https://www.linkedin.com/posts/..."
                  required
                />
                <p className="text-[10px] text-gray-500 mt-2">Example: https://www.linkedin.com/posts/username_activity-1234567890-abcd</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tag</label>
                  <select
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f172a] border border-[#1d293a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0A66C2]"
                  >
                    <option value="tech">Tech</option>
                    <option value="career">Career</option>
                    <option value="project">Project</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-end pb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded text-[#0A66C2] focus:ring-[#0A66C2] bg-[#0f172a] border-[#1d293a]"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-400">Featured</label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#1d293a] flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 rounded-lg border border-[#1d293a] text-white hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#16f2b3] text-[#0f172a] font-bold py-2 rounded-lg hover:bg-[#12c292] transition-colors"
                >
                  {currentPost ? 'Update' : 'Save URL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
