'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsFilePost, BsPlus, BsEye } from 'react-icons/bs';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you would fetch these stats from an API
        // For now, we'll just simulate a delay and set some dummy data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60A5FA]"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Posts */}
        <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Posts</p>
              <h2 className="text-3xl font-bold text-white mt-1">{stats.totalPosts}</h2>
            </div>
            <div className="p-3 bg-[#2d3250] rounded-full">
              <BsFilePost className="text-[#60A5FA]" size={24} />
            </div>
          </div>
        </div>
        
        {/* Published Posts */}
        <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Published</p>
              <h2 className="text-3xl font-bold text-white mt-1">{stats.publishedPosts}</h2>
            </div>
            <div className="p-3 bg-[#2d3250] rounded-full">
              <BsEye className="text-[#34D399]" size={24} />
            </div>
          </div>
        </div>
        
        {/* Draft Posts */}
        <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Drafts</p>
              <h2 className="text-3xl font-bold text-white mt-1">{stats.draftPosts}</h2>
            </div>
            <div className="p-3 bg-[#2d3250] rounded-full">
              <BsFilePost className="text-[#F87171]" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/admin/posts/new" 
            className="flex items-center p-4 bg-[#2d3250] rounded-lg hover:bg-[#3d4260] transition-colors"
          >
            <div className="p-3 bg-[#1b203e] rounded-full mr-4">
              <BsPlus className="text-[#60A5FA]" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-white">Create New Post</h3>
              <p className="text-sm text-gray-400">Start writing a new blog post</p>
            </div>
          </Link>
          
          <Link 
            href="/admin/posts" 
            className="flex items-center p-4 bg-[#2d3250] rounded-lg hover:bg-[#3d4260] transition-colors"
          >
            <div className="p-3 bg-[#1b203e] rounded-full mr-4">
              <BsFilePost className="text-[#34D399]" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-white">Manage Posts</h3>
              <p className="text-sm text-gray-400">Edit or delete existing posts</p>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        </div>
        
        {stats.totalPosts > 0 ? (
          <div className="space-y-4">
            {/* This would be populated with actual data in a real app */}
            <p className="text-gray-400">No recent activity to display.</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No blog posts yet</p>
            <Link 
              href="/admin/posts/new" 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white rounded-md hover:from-[#34D399] hover:to-[#60A5FA] transition-all duration-300"
            >
              <BsPlus className="mr-2" size={20} />
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 