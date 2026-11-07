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

Contact delivery uses deployment environment variables; no credentials are embedded in the application. Configure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` for reCAPTCHA v3. For Gmail, configure `EMAIL_ADDRESS` and `GMAIL_PASSKEY`; alternatively use `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, and `SMTP_PORT`. `CONTACT_EMAIL` sets the recipient. See `.env.example` for the supported settings. The public site key can alternatively be provided as `RECAPTCHA_SITE_KEY` at runtime. Restart or redeploy after changing environment variables.

Use a **reCAPTCHA v3** site key and secret from the same registration. Add `plan.com.np` and `www.plan.com.np` to the Google reCAPTCHA domain list. If testing another domain, register it with Google and add it to `RECAPTCHA_ALLOWED_HOSTNAMES` (comma-separated); the configured app URL and Vercel deployment hostname are also accepted by the server. For Gmail, use the sender account's app password, not its login password. The authenticated sender must be allowed to send email through the chosen SMTP provider.

`GET /api/contact` exposes only the public site key and readiness status. `CAPTCHA_NOT_CONFIGURED` means the site key or secret is missing; `EMAIL_NOT_CONFIGURED` means sender credentials or SMTP port are missing/invalid. Check these in the active hosting environment, then redeploy. Actual key validity and SMTP authentication are checked during submission. Tokens must pass Google's score, action, hostname, and two-minute expiry checks; missing configuration never skips verification. The form generates a new token on each attempt, blocks duplicate sends, and retains typed text after errors. A success message means the SMTP server accepted the recipient; inbox delivery depends on the mail provider.

Without contact-service configuration, visitors can still use the direct email link. Missing configuration never bypasses reCAPTCHA or reports a message as delivered.

### PlanBot configuration

Set a valid server-side `GROQ_API_KEY` in the hosting environment and redeploy. Never use a `NEXT_PUBLIC_` variable for this key. `GROQ_MODEL` optionally selects a preferred model (default `openai/gpt-oss-20b`); verify account model access in the Groq console. Missing or invalid credentials cannot be fixed by frontend changes.

`MONGODB_URI` enables persistent chat history. Replies still work during a history database outage, and recent turns are sent with the chat request to preserve conversational context without requiring database access. Provider failures are reported honestly; PlanBot never substitutes canned responses for AI replies.

### Discord notifications and PlanBot history

Set `DISCORD_WEBHOOK_URL` in Vercel Production to the channel's Discord webhook URL. The existing visitor alert runs once per browser-tab session; the first sent PlanBot message is saved and triggers a separate new-chat alert with a clickable admin conversation link. Opening the chat widget alone does not trigger a chat alert. Messages are recorded even if the AI service cannot reply. Subsequent messages update the same conversation without repeated alerts. Failed notifications are retried on a later message; Discord delivery is best effort during outages.

Read history at **https://www.plan.com.np/admin/chats** (or `/admin/chats` on your configured `NEXT_PUBLIC_APP_URL`). Sign in with your existing **admin** account. Discord links open `/admin/chats/<sessionId>` and return there after login. The list is paginated; a conversation displays its latest 500 messages. Use Refresh to see new messages. `MONGODB_URI` and `NEXTAUTH_SECRET` must be configured, and an admin account must exist. The history API enforces the admin role and never caches transcripts. Discord receives the session link, not the transcript. No separate Discord bot token is needed.

### Admin workspace

Open `/admin/login` with your existing administrator account. The responsive workspace includes blog publishing, LinkedIn management, conversation history, and a live overview of post counts, drafts, recent stories, recent chats, and seven days of new-conversation activity (UTC). Overview numbers come from MongoDB; unavailable data displays an error and retry action rather than placeholder counts. Service indicators show whether PlanBot, Discord, and contact settings are configured, not whether an external provider is currently healthy.

The mobile navigation supports a modal drawer, keyboard focus, Escape, and automatic closure after navigation or switching to a laptop layout. Login includes password visibility, Caps Lock feedback, and safe return links to admin conversations. Admin pages are excluded from search indexing; overview and conversation APIs enforce the administrator role and disable caching. No additional environment variables are required.

### Audience and conversion metrics

The admin overview includes first-party analytics with 7-, 30-, and 90-day UTC filters. Data starts accumulating after this update; old Discord notifications are not backfilled. `MONGODB_URI` is the only storage requirement. Anonymous events use their own collection and survive server restarts. Reports require an administrator session and expose aggregate counts only.

- **Unique visitors:** distinct random browser IDs stored locally. Different devices, cleared storage, or storage restrictions can count the same person again. This is a browser estimate, not an identified-person count.
- **Sessions:** a random session ID renews after 30 minutes without a tracked interaction. Reloads and navigation keep the visitor ID; returning after the session timeout starts a new session. When storage is blocked, IDs last only in memory.
- **Page views / popular pages:** initial public page loads and pathname changes; query-only changes, admin pages, and the visitor-test page are excluded.
- **Traffic sources:** first source per session, using `utm_source`, otherwise the external referring domain, otherwise direct/unknown. Top sources include an Other bucket where needed. Full referrer URLs, query strings, names, emails, and IP addresses are not stored in analytics.
- **Résumé clicks:** clicks on the existing Get Resume link. The Google Docs behavior is preserved. These are not confirmed PDF downloads or file saves.
- **Project opens:** clicks to repositories owned by `GhimirePlan` (canonicalized server-side). The project section remains hidden. Links in blog posts and PlanBot replies can generate these events; external project-page views are not inferred.
- **Contact submissions:** generated on the server only after SMTP accepts the recipient. Validation failures, reCAPTCHA rejections, and email failures do not count. No message contents or sender details enter analytics, and an analytics outage does not fail a successful email submission.

The lightweight tracker runs only on public pages, sends small same-origin keepalive requests, and respects Do Not Track and Global Privacy Control. Known crawler requests and authenticated administrator requests are skipped, including admin visits to public pages. Browser blockers, opt-outs, and network failures can reduce counts; contact-success totals are operational events without visitor identifiers. Existing visitor Discord notifications remain a separate integration.
