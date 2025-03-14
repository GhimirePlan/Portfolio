# Portfolio Website with Blog System

A modern portfolio website with a blog system built using Next.js, Tailwind CSS, and MongoDB.

## Features

- Responsive portfolio website
- Admin panel for managing blog posts
- Authentication using NextAuth.js
- MongoDB integration for data storage
- Rich text editor for blog content
- SEO optimized

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# NextAuth.js secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

Replace the placeholders in the MongoDB connection string with your actual MongoDB Atlas credentials.

### Setting Up MongoDB

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (the free tier is sufficient for development)
3. Set up database access:
   - Create a new database user with read and write permissions
   - Remember the username and password
4. Set up network access:
   - Add your IP address to the IP access list
   - For development, you can allow access from anywhere
5. Get your connection string:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Choose Node.js as the driver
   - Copy the connection string and replace `<username>`, `<password>`, and `<dbname>` with your actual values

### Seeding the Database

To seed the database with initial data, run:

```bash
node scripts/seed-data.js
```

This will create an admin user and sample blog posts.

### Creating an Admin User

If you prefer to create an admin user manually, you can use the admin setup page:

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Navigate to `http://localhost:3000/admin/setup`
3. Fill in the form to create an admin user

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `/app` - Next.js app directory
  - `/admin` - Admin panel pages
  - `/api` - API routes
  - `/blog` - Blog pages
  - `/components` - React components
- `/lib` - Utility functions and libraries
- `/models` - MongoDB models
- `/public` - Static assets
- `/scripts` - Utility scripts
- `/utils` - Helper functions

## Technologies Used

- Next.js 13+ (App Router)
- Tailwind CSS
- MongoDB
- NextAuth.js
- React Quill
- React Icons

## License

This project is licensed under the MIT License - see the LICENSE file for details.
