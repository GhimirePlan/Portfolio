# Portfolio Website with Blog

A modern portfolio website with an integrated blog system built with Next.js, MongoDB, and NextAuth.js.

## Features

- Responsive portfolio showcase
- Blog system with rich text editor
- Admin panel for content management
- Authentication with NextAuth.js
- MongoDB integration for data storage
- Image optimization with Next.js Image component
- PlanBot - AI assistant powered by Groq's LLaMA3-70b model

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
- `GROQ_API_KEY`: API key for Groq AI (used by PlanBot)

## Admin Setup

After deployment, visit `/admin/setup` to create your admin account. This page is only accessible once when no admin users exist.

## Project Structure

- `/app`: Next.js app directory
  - `/admin`: Admin panel pages
  - `/api`: API routes
    - `/planbot`: PlanBot API endpoint
  - `/blog`: Blog pages
  - `/planbot`: PlanBot chat interface
  - `/components`: Reusable components
- `/public`: Static assets
- `/lib`: Utility functions and database connection

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- MongoDB for the database solution

### Contact form configuration

Contact delivery uses deployment environment variables; no credentials are embedded in the application. Configure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` for reCAPTCHA v3. For Gmail, configure `EMAIL_ADDRESS` and `GMAIL_PASSKEY`; alternatively use `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, and `SMTP_PORT`. `CONTACT_EMAIL` sets the recipient. See `.env.example` for the supported settings. Restart or redeploy after changing public environment variables.

Without contact-service configuration, visitors can still use the direct email link. Missing configuration never bypasses reCAPTCHA or reports a message as delivered.

### PlanBot configuration

Set a valid server-side `GROQ_API_KEY` in the hosting environment and redeploy. Never use a `NEXT_PUBLIC_` variable for this key. `GROQ_MODEL` optionally selects a preferred model (default `openai/gpt-oss-20b`); verify account model access in the Groq console. Missing or invalid credentials cannot be fixed by frontend changes.

`MONGODB_URI` enables persistent chat history. Replies still work during a history database outage, and recent turns are sent with the chat request to preserve conversational context without requiring database access. Provider failures are reported honestly; PlanBot never substitutes canned responses for AI replies.
