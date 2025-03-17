# Portfolio Website with Blog

A modern portfolio website with an integrated blog system built with Next.js, MongoDB, and NextAuth.js.

## Features

- Responsive portfolio showcase
- Blog system with rich text editor
- Admin panel for content management
- Authentication with NextAuth.js
- MongoDB integration for data storage
- Image optimization with Next.js Image component

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your MongoDB connection string and NextAuth secret.

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Method 1: Using the Deployment Script

1. Create a production environment file
```bash
cp .env.production.example .env.production
```
Edit `.env.production` with your production environment variables.

2. Run the deployment script
```bash
node deploy.js
```
Follow the prompts to complete the deployment.

### Method 2: Manual Deployment

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Build the project
```bash
npm run build
```

3. Deploy to Vercel
```bash
vercel --prod
```

4. Configure environment variables in the Vercel dashboard:
   - MONGODB_URI
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (set to your deployment URL)

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: URL of your application (in production, this should be your deployment URL)

## Admin Setup

After deployment, visit `/admin/setup` to create your admin account. This page is only accessible once when no admin users exist.

## Project Structure

- `/app`: Next.js app directory
  - `/admin`: Admin panel pages
  - `/api`: API routes
  - `/blog`: Blog pages
  - `/components`: Reusable components
- `/public`: Static assets
- `/lib`: Utility functions and database connection

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- MongoDB for the database solution
