# Plan Ghimire · Portfolio

A personal portfolio and publishing platform by **Plan Ghimire**, an Electronics, Communication & Information Engineering student from Nepal exploring embedded systems, networking, and applied AI.

The site brings together engineering interests, research writing, and an AI portfolio assistant in a responsive interface—with a private workspace for publishing, conversations, and contact messages.

**[Visit the portfolio](https://www.plan.com.np)** · **[Read the blog](https://www.plan.com.np/blog)** · **[Talk to PlanBot](https://www.plan.com.np/planbot)**

## What’s inside

### Portfolio & writing

- Responsive homepage with an introduction, engineering journey, LinkedIn spotlight, and contact form.
- Rich-text blog articles with support for images, videos, related documents, and reading-time estimates.
- A compact developer-status strip with GitHub activity and optional Discord presence and Spotify listening activity through Lanyard.
- Light and dark themes, keyboard navigation, and reduced-motion support.

### PlanBot

A conversational assistant for questions about Plan’s work, studies, research, and published articles. PlanBot retrieves relevant public portfolio and blog content, includes article links, and supports follow-up questions and saved conversations.

The assistant uses Groq for responses. Retrieval is limited to public sources; answers can be checked against the linked articles. Private admin content and contact submissions are excluded from its knowledge retrieval.

### Admin workspace

- Blog publishing and LinkedIn spotlight management.
- Conversation history and a contact inbox with delivery status and email reply links.
- Anonymous browser-based audience metrics, traffic sources, popular pages, résumé clicks, project-link opens, and received contact submissions.
- Date filters and developer-status controls.

### Contact & notifications

Contact submissions are verified with reCAPTCHA and can be received in the admin inbox or by email. Discord webhook alerts cover portfolio visits, new conversations, and contact submissions, with protected links to the relevant admin records.

## Technology

| Area | Technologies |
| --- | --- |
| Application | Next.js 14 App Router, React 18, JavaScript |
| Interface | Tailwind CSS, CSS modules, Framer Motion, React Icons |
| Data & authentication | MongoDB, Mongoose, NextAuth.js |
| AI assistant | Groq, published-content retrieval |
| Integrations | GitHub API, Lanyard, Discord webhooks, reCAPTCHA v3, SMTP |
| Hosting | Vercel |

## Run locally

Use **Node.js 22 or newer** and npm. MongoDB and integration credentials enable the corresponding dynamic features.

```bash
git clone https://github.com/GhimirePlan/Portfolio.git
cd Portfolio
npm ci
cp .env.example .env.local
```

Configure the required services using the [configuration guide](docs/configuration.md), then start the development server:

```bash
npm run dev
```

Open **http://localhost:3000**.

For a production build:

```bash
npm run build
npm run start
```

For lint checks:

```bash
npm run lint
```

## Repository structure

```text
app/
  admin/        Publishing, inbox, conversations, and analytics
  api/          Server endpoints and integration handlers
  blog/         Blog listing and article pages
  components/   Portfolio and shared interface components
  planbot/      Dedicated assistant page
lib/            Retrieval, database, notification, and service utilities
models/         MongoDB schemas
utils/          Public portfolio data and client utilities
public/         Images, fonts, and static assets
docs/           Configuration and architecture documentation
```

## Documentation

- [Configuration & deployment](docs/configuration.md)
- [Architecture & data flows](docs/architecture.md)
- [Contributing](CONTRIBUTING.md)

## Connect

[Portfolio](https://www.plan.com.np) · [GitHub](https://github.com/GhimirePlan) · [LinkedIn](https://www.linkedin.com/in/plan-ghimire/) · [Email](mailto:contact@plan.com.np)
