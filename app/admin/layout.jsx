'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BsHouseDoor, 
  BsFilePost, 
  BsPlus, 
  BsBoxArrowRight, 
  BsList, 
  BsX 
} from 'react-icons/bs';
import { AdminProviders } from './providers';

export default function AdminLayout({ children }) {
  // If the path is /admin/login, render the children without the admin layout
  // but still wrap it in the AdminProviders
  const pathname = usePathname();
  if (pathname === '/admin/login') {
    return <AdminProviders>{children}</AdminProviders>;
  }

  return (
    <AdminProviders>
      <AdminDashboard>{children}</AdminDashboard>
    </AdminProviders>
  );
}

function AdminDashboard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);
  
  // If the user is not authenticated, show a loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60A5FA]"></div>
      </div>
    );
  }
  
  // If not authenticated, don't render anything (will be redirected by the useEffect)
  if (status !== 'authenticated') {
    return null;
  }
  
  // Navigation items
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <BsHouseDoor /> },
    { name: 'All Posts', href: '/admin/posts', icon: <BsFilePost /> },
    { name: 'New Post', href: '/admin/posts/new', icon: <BsPlus /> },
    { name: 'LinkedIn Posts', href: '/admin/linkedin-posts', icon: <BsFilePost /> },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };
  
  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 z-50 p-4 md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded-md bg-[#1b203e] hover:bg-[#2d3250] transition-colors"
        >
          {sidebarOpen ? <BsX size={24} /> : <BsList size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40 transition-transform duration-300 ease-in-out md:relative md:flex md:flex-col w-64 bg-[#1b203e] border-r border-[#1d293a]`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-[#1d293a]">
            <Link href="/admin" className="flex items-center space-x-2">
              <Image 
                src="/admin-logo.svg" 
                alt="Admin Logo" 
                width={40} 
                height={40} 
              />
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </Link>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-[#60A5FA]/20 to-[#34D399]/20 text-white'
                        : 'text-gray-300 hover:bg-[#2d3250] hover:text-white'
                    }`}
                  >
                    <span className={`mr-3 ${isActive ? 'text-[#16f2b3]' : ''}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-[#1d293a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] flex items-center justify-center text-white font-bold">
                  {session?.user?.name?.charAt(0) || 'A'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {session?.user?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <BsBoxArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}