const path = require('path');

module.exports = {
 
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  experimental: {
    optimizePackageImports: ['react-icons/fa', 'react-icons/bs', 'react-icons/bi', 'react-icons/ci', 'react-icons/io', 'react-icons/md', 'react-icons/fi', 'react-icons/tb', 'react-icons/fa6'],
  },
  async headers() {
    return [{ source: '/fonts/yellowtail-v1.woff2', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    
    // Handle Node.js modules in browser environment
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      child_process: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
}