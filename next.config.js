const path = require('path');

module.exports = {
  basePath: '/Portfolio',
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
}