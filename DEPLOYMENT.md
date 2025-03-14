# Deploying to Vercel

This guide will help you deploy your portfolio website with a blog system to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
3. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account if you don't have one
2. Create a new cluster (the free tier is sufficient for development)
3. Set up database access:
   - Create a new database user with read and write permissions
   - Remember the username and password
4. Set up network access:
   - Add `0.0.0.0/0` to the IP access list to allow access from anywhere (for Vercel)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Choose Node.js as the driver
   - Copy the connection string and replace `<username>`, `<password>`, and `<dbname>` with your actual values

## Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXTAUTH_SECRET`: A secure random string for NextAuth.js (you can use the one from your .env.local file)
   - `NEXTAUTH_URL`: The URL of your deployed application (e.g., https://your-portfolio.vercel.app)
6. Click "Deploy"

## Step 3: Seed the Database

After deployment, you need to seed your database with initial data:

1. Update the `MONGODB_URI` in your local `.env.local` file to match the one you're using for production
2. Run the seed script locally:
   ```bash
   node scripts/seed-data.js
   ```
3. Alternatively, you can create an admin user through the admin setup page:
   - Visit `https://your-portfolio.vercel.app/admin/setup`
   - Fill in the form to create an admin user

## Step 4: Verify Deployment

1. Visit your deployed application at the URL provided by Vercel
2. Test the blog functionality:
   - Log in to the admin panel at `/admin/login`
   - Create a new blog post
   - Verify that the blog post appears on the blog page

## Troubleshooting

If you encounter any issues with your deployment, check the following:

1. **MongoDB Connection**: Make sure your MongoDB Atlas connection string is correct and that your IP access list includes `0.0.0.0/0`
2. **Environment Variables**: Verify that all required environment variables are set in the Vercel project settings
3. **Build Errors**: Check the build logs in the Vercel dashboard for any errors
4. **NextAuth.js**: Make sure `NEXTAUTH_URL` is set to your production URL

## Updating Your Deployment

When you push changes to your Git repository, Vercel will automatically rebuild and redeploy your application. 