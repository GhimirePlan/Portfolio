'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BsLock, BsEnvelope, BsInfoCircle } from 'react-icons/bs';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Get error from URL if present
  useEffect(() => {
    const errorFromUrl = searchParams.get('error');
    if (errorFromUrl) {
      setError(errorFromUrl === 'CredentialsSignin' 
        ? 'Invalid email or password' 
        : errorFromUrl);
    }
  }, [searchParams]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Signing in with:', { email, password: '****' });
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      console.log('Sign in result:', result);
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </div>
        
        <div className="mt-8 bg-[#1b203e] rounded-lg shadow-xl p-8 border border-[#1d293a]">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BsEnvelope className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#1d293a] rounded-md bg-[#0f172a] placeholder-gray-500 text-white focus:outline-none focus:ring-[#60A5FA] focus:border-[#60A5FA] sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BsLock className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#1d293a] rounded-md bg-[#0f172a] placeholder-gray-500 text-white focus:outline-none focus:ring-[#60A5FA] focus:border-[#60A5FA] sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-[#60A5FA] to-[#34D399] hover:from-[#34D399] hover:to-[#60A5FA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60A5FA] transition-all duration-300"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              <BsInfoCircle className="mr-1" />
              {showDebug ? 'Hide' : 'Show'} Development Info
            </button>
            
            {showDebug && (
              <div className="mt-2 p-3 bg-[#0f172a] border border-[#1d293a] rounded-md text-xs text-gray-400 font-mono">
                <p>Contact for development:</p>
                <p className="mt-1">Email: contact@plan.com.np</p>
                
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[#16f2b3] hover:text-[#60A5FA] transition-colors">
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 