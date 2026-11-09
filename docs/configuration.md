# Configuration & deployment

The application uses environment variables for service configuration. Start with `.env.example`; local values belong in `.env.local`. Production values belong in the hosting provider’s environment settings. Environment files containing real credentials should not be committed.

## Service configuration

| Feature | Variables | Notes |
| --- | --- | --- |
| Database | `MONGODB_URI` | Stores articles, settings, chats, inbox entries, and analytics events. |
| Authentication | `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | Use the application’s full origin for the authentication URL. Admin endpoints require the administrator role. |
| Public origin | `NEXT_PUBLIC_APP_URL` | Canonical application origin used for links in alerts. |
| PlanBot | `GROQ_API_KEY`, optional `GROQ_MODEL` | Server-side credentials. The default preferred model is `openai/gpt-oss-20b`, with provider fallbacks. |
| GitHub | `GITHUB_USERNAME`, optional `GITHUB_TOKEN` | Defaults to `GhimirePlan`; an optional token increases API limits. |
| reCAPTCHA v3 | `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Use matching keys registered for the deployed domains. `RECAPTCHA_SITE_KEY` is a server-side alias for the public site key. |
| CAPTCHA domains | `RECAPTCHA_ALLOWED_HOSTNAMES` | Comma-separated hostnames; defaults to `plan.com.np,www.plan.com.np`. |
| Contact email | `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, `SMTP_PORT`, `CONTACT_EMAIL` | Defaults to Gmail SMTP on port 587. Gmail requires an App Password. `EMAIL_ADDRESS` and `GMAIL_PASSKEY` are supported aliases for sender credentials. |
| Discord alerts | `DISCORD_WEBHOOK_URL` | Handles visitor, chat, and contact alerts. Independent of presence. |
| Discord / Spotify presence | `DISCORD_USER_ID` | Numeric Discord ID enrolled with Lanyard. Enable each integration independently in the admin overview. |
| Google sign-in | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Configure when using the existing Google authentication provider. Signing in does not automatically grant admin access. |

`.env.example` also includes optional settings for other integrations retained in the repository.

## Lanyard presence

Join the Lanyard Discord server with the configured Discord account. To expose listening activity, connect Spotify in Discord and enable displaying Spotify as status. Neither a Discord webhook nor a Spotify username provides presence access on its own.

Spotify activity is retrieved through Lanyard. No Spotify OAuth client ID, client secret, or refresh token is required. Disabled integrations make no presence request. Missing, idle, or unavailable listening data hides the Spotify item. Visible status components refresh approximately once per minute.

## Contact delivery

A valid submission must pass reCAPTCHA score, action, hostname, and expiry checks. It is then stored in the admin inbox when database access is available; email delivery is independent. Receiving a message through either channel is a successful receipt. If both channels fail, the form reports an error and retains the visitor’s text.

Discord contact alerts link to the protected inbox record without including sender details or message contents. Email replies from the inbox open the administrator’s email application.

`GET /api/contact` exposes the public site key and configuration readiness, not credentials. Readiness indicates configured services, not successful SMTP authentication or database health.

## Admin access

| Route | Purpose |
| --- | --- |
| `/admin/login` | Administrator sign-in |
| `/admin` | Overview, audience metrics, and developer-status controls |
| `/admin/posts` | Blog management |
| `/admin/linkedin-posts` | LinkedIn spotlight management |
| `/admin/chats` | Saved PlanBot conversations |
| `/admin/inbox` | Contact submissions and delivery status |

An administrator account must exist in MongoDB. The repository includes bootstrap tooling in `scripts/create-admin.js` and an initial-account setup endpoint; review their configuration before using them. Existing authentication middleware protects admin pages, so `/admin/setup` should not be assumed to be a publicly accessible onboarding route. Production account provisioning should be performed in a controlled environment.

## Vercel deployment

1. Import this GitHub repository as a Next.js project.
2. Configure the environment variables required by the enabled features in the intended deployment environment.
3. Deploy the repository’s branch through Vercel’s Git integration.
4. Redeploy after changing environment settings so the application receives the new configuration.

The application needs server-side route handlers for authentication, MongoDB, AI responses, notifications, and contact delivery. A static export or GitHub Pages deployment does not provide these services. `npm run build` and `npm run start` are the supported application build/run workflow; legacy deployment helper scripts are not the primary deployment path.
