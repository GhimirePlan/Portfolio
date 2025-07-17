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
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="bg-[#1b203e] border border-[#1d293a] rounded-lg px-4 py-2">
          <p className="text-gray-400 text-sm">Welcome, <span className="text-[#60A5FA] font-medium">Admin</span></p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Posts */}
        <div className="bg-gradient-to-br from-[#1b203e] to-[#2d3250] border border-[#1d293a] rounded-lg p-6 shadow-lg hover:shadow-[#60A5FA]/10 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Posts</p>
              <h2 className="text-3xl font-bold text-white mt-1">{stats.totalPosts}</h2>
              <div className="h-1 w-16 bg-[#60A5FA] rounded-full mt-3"></div>
            </div>
            <div className="p-4 bg-[#2d3250]/70 rounded-full shadow-inner border border-[#60A5FA]/20">
              <BsFilePost className="text-[#60A5FA]" size={28} />
            </div>
          </div>
        </div>
        
        {/* Published Posts */}
        <div className="bg-gradient-to-br from-[#1b203e] to-[#2d3250] border border-[#1d293a] rounded-lg p-6 shadow-lg hover:shadow-[#34D399]/10 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Published</p>
              <h2 className="text-3xl font-bold text-white mt-1">{stats.publishedPosts}</h2>
              <div className="h-1 w-16 bg-[#34D399] rounded-full mt-3"></div>
            </div>
            <div className="p-4 bg-[#2d3250]/70 rounded-full shadow-inner border border-[#34D399]/20">
              <BsEye className="text-[#34D399]" size={28} />
            </div>
          </div>
        </div>
        
        {/* Draft Posts */}
        <div className="bg-gradient-to-br from-[#1b203e] to-[#2d3250] border border-[#1d293a] rounded-lg p-6 shadow-lg hover:shadow-[#F87171]/10 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Drafts</p>
              <h2 className="text-3xl font-bold text-white mt-1">{stats.draftPosts}</h2>
              <div className="h-1 w-16 bg-[#F87171] rounded-full mt-3"></div>
            </div>
            <div className="p-4 bg-[#2d3250]/70 rounded-full shadow-inner border border-[#F87171]/20">
              <BsFilePost className="text-[#F87171]" size={28} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-[#1b203e] to-[#2d3250] border border-[#1d293a] rounded-lg p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <div className="h-1 w-20 bg-[#60A5FA] rounded-full mt-2"></div>
          </div>
          <div className="p-2 bg-[#2d3250]/70 rounded-full border border-[#1d293a]">
            <BsPlus className="text-[#60A5FA]" size={20} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/admin/posts/new" 
            className="flex items-center p-5 bg-gradient-to-r from-[#2d3250] to-[#3d4260] rounded-lg hover:from-[#3d4260] hover:to-[#2d3250] transition-all duration-300 shadow-md hover:shadow-[#60A5FA]/10 hover:-translate-y-1 border border-[#1d293a]/50 group"
          >
            <div className="p-4 bg-[#1b203e] rounded-full mr-5 shadow-inner border border-[#60A5FA]/20 group-hover:bg-[#60A5FA]/10 transition-all duration-300">
              <BsPlus className="text-[#60A5FA]" size={28} />
            </div>
            <div>
              <h3 className="font-medium text-white text-lg">Create New Post</h3>
              <p className="text-sm text-gray-400 mt-1">Start writing a new blog post</p>
            </div>
          </Link>
          
          <Link 
            href="/admin/posts" 
            className="flex items-center p-5 bg-gradient-to-r from-[#2d3250] to-[#3d4260] rounded-lg hover:from-[#3d4260] hover:to-[#2d3250] transition-all duration-300 shadow-md hover:shadow-[#34D399]/10 hover:-translate-y-1 border border-[#1d293a]/50 group"
          >
            <div className="p-4 bg-[#1b203e] rounded-full mr-5 shadow-inner border border-[#34D399]/20 group-hover:bg-[#34D399]/10 transition-all duration-300">
              <BsFilePost className="text-[#34D399]" size={28} />
            </div>
            <div>
              <h3 className="font-medium text-white text-lg">Manage Posts</h3>
              <p className="text-sm text-gray-400 mt-1">Edit or delete existing posts</p>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-[#1b203e] to-[#2d3250] border border-[#1d293a] rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <div className="h-1 w-20 bg-[#F87171] rounded-full mt-2"></div>
          </div>
          <div className="p-2 bg-[#2d3250]/70 rounded-full border border-[#1d293a]">
            <BsEye className="text-[#F87171]" size={20} />
          </div>
        </div>
        
        {stats.totalPosts > 0 ? (
          <div className="space-y-4">
            {/* This would be populated with actual data in a real app */}
            <div className="bg-[#2d3250]/50 p-4 rounded-lg border border-[#1d293a]/50">
              <p className="text-gray-300">No recent activity to display.</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-[#2d3250]/30 rounded-lg border border-[#1d293a]/50">
            <div className="inline-flex items-center justify-center p-4 bg-[#1b203e] rounded-full mb-4 border border-[#F87171]/20">
              <BsFilePost className="text-[#F87171]" size={28} />
            </div>
            <p className="text-gray-300 mb-6 text-lg">No blog posts yet</p>
            <Link 
              href="/admin/posts/new" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#60A5FA] to-[#34D399] text-white rounded-md hover:from-[#34D399] hover:to-[#60A5FA] transition-all duration-300 shadow-md hover:shadow-[#60A5FA]/20"
            >
              <BsPlus className="mr-2" size={24} />
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}