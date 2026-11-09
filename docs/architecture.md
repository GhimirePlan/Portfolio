# Architecture & data flows

## Application boundaries

The Next.js App Router serves public portfolio pages and a separate authenticated admin workspace. Browser components handle presentation and interaction; server route handlers hold service credentials, access MongoDB, and call external providers.

Public profile and experience data live in `utils/data/`. Published articles and site settings are stored in MongoDB. GitHub information comes from GitHub’s public API with bounded upstream caching.

## PlanBot retrieval

For each request, the assistant retrieves current public portfolio data and published blog metadata. Text search and metadata matching select up to three relevant articles; bounded plain-text excerpts and canonical article links are passed to the model. The recent metadata lookup is capped at 50 posts, and a smaller recent/relevant selection is supplied to keep prompts manageable. GitHub context uses the homepage’s public source.

Background notes in `mydata.txt` are secondary to current sources. Article text is treated as evidence, not instructions. Retrieval failures are represented as unavailable sources rather than empty collections. Responses include public grounding metadata for verification. No retrieval process includes drafts, contact submissions, admin records, secrets, or other visitors’ conversations.

Conversation turns are stored independently of response generation. A storage outage does not need to prevent an AI reply. New-conversation Discord alerts use a database lease to reduce duplicate alerts and link to admin-only history. Failed alerts can retry on a later message.

## Contact flow

```text
Form validation → reCAPTCHA verification → inbox storage
                                            ├─ Discord notification
                                            └─ SMTP delivery
```

SMTP and Discord delivery run independently after the storage attempt. Inbox records retain delivery status. A receipt succeeds if inbox storage or SMTP delivery succeeds; analytics record that receipt once. The admin inbox lists submissions with pagination and renders message contents as plain text.

## Audience metrics

Analytics events use random browser and session identifiers rather than authenticated identities. Sessions renew after 30 minutes without a tracked interaction. Identifiers remain in memory when browser storage is unavailable.

Reports support 7-, 30-, and 90-day UTC periods and include:

- Distinct anonymous browsers, sessions, and page views.
- First-source-per-session attribution using `utm_source`, referring domain, or direct/unknown.
- Popular public paths, résumé-link clicks, and owned GitHub repository-link opens.
- Contact receipts accepted by the inbox or email channel.

Reports begin with collected events; older Discord messages and email history are not backfilled. Browser blockers, opt-outs, cleared storage, and network failures affect counts. Résumé clicks are not confirmed file downloads, and repository-link opens are not destination-page views.

Admin pages and authenticated administrator activity are excluded from browser-event collection. The analytics endpoint respects Do Not Track and Global Privacy Control and skips known crawlers. Analytics do not store full referrer URLs, URL query strings, contact contents, or visitor IP addresses. Aggregate report endpoints enforce the administrator role and disable caching.

## Discord alerts

Visitor notifications are separate from analytics. Footprints alerts can include the request IP, approximate hosting-provided location, browser/device/OS details, timezone, languages, display dimensions, and optional connection estimates. Browser values are self-reported, location is approximate, and unsupported details are omitted or marked unavailable. Page/referrer query strings and fragments are stripped; only selected campaign labels are included.

All webhook messages share length limits, mention suppression, timestamps, and consistent footers. An explicit rate-limit response can retry once for a requested wait of at most one second. Uncertain network failures are not automatically retried. Notification delivery remains best effort.

## Developer status & direct contact

The homepage’s compact strip combines availability, recent GitHub activity, and optional Lanyard presence/listening activity. Settings persist in MongoDB and are editable in the admin overview. The Discord and Spotify toggles are independent and default off.

The PlanBot page can show a direct-contact note when Discord reports the owner online. Its WhatsApp link opens a separate conversation; Discord presence is not proof of WhatsApp availability or a live-human takeover of the assistant.
