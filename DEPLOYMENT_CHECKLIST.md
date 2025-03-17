# Deployment Checklist for Vercel

Use this checklist to ensure a smooth deployment of your portfolio website to Vercel.

## Pre-Deployment

- [ ] Ensure all features are working locally
- [ ] Run `npm run build` to check for build errors
- [ ] Update all environment variables in `.env.production`
- [ ] Optimize images and assets
- [ ] Check for console errors and warnings
- [ ] Test responsive design on multiple devices
- [ ] Verify all links are working correctly
- [ ] Ensure blog posts render correctly
- [ ] Test admin functionality
- [ ] Verify authentication works properly

## Deployment Process

- [ ] Create a Vercel account if you don't have one
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run the deployment script: `node deploy.js`
- [ ] Or deploy manually: `vercel --prod`
- [ ] Set up the following environment variables in Vercel:
  - [ ] MONGODB_URI
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL (set to your deployment URL)
- [ ] Verify the deployment was successful

## Post-Deployment

- [ ] Test the live site thoroughly
- [ ] Check that all pages load correctly
- [ ] Verify that images are loading properly
- [ ] Test the admin login
- [ ] Create a test blog post
- [ ] Check that the blog post appears on the blog page
- [ ] Test the share functionality
- [ ] Verify that environment variables are working correctly
- [ ] Check for any console errors
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices

## Troubleshooting Common Issues

### Images Not Loading
- Ensure the domain is added to `next.config.js` under `images.domains`
- Check that image paths are correct

### Authentication Issues
- Verify NEXTAUTH_URL is set to your deployment URL
- Check NEXTAUTH_SECRET is properly set
- Ensure MongoDB connection is working

### MongoDB Connection Issues
- Verify MONGODB_URI is correct
- Check that IP access is allowed in MongoDB Atlas
- Ensure the database user has the correct permissions

### Build Errors
- Check for missing dependencies
- Look for syntax errors in your code
- Ensure all imports are correct

## Monitoring and Maintenance

- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure analytics (e.g., Google Analytics)
- [ ] Plan for regular updates and maintenance
- [ ] Document any custom configurations or workarounds 