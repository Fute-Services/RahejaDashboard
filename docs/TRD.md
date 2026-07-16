# Technical Requirements Document (TRD)
## Raheja Properties Showcase — Website & Mobile App

**Last Updated:** 2026-07-16

---

## 1. Overview

A single backend API serves both the public website and the React Native mobile app. Property content is the only dynamic data in the system; there is no user auth, no transactional data, no CRM.

## 2. Proposed Stack

| Layer | Choice | Reason |
|---|---|---|
| Website (frontend) | Next.js (React) | SSR/SSG for SEO on a public showcase site, fast, easy image handling |
| Mobile App | React Native (Expo) | Cross-platform iOS + Android from one codebase; shares data-fetching logic/types with website |
| Backend API | Node.js + Express (or Next.js API routes) | Simple REST API, small surface area, easy to maintain |
| Database | PostgreSQL (or MongoDB if data stays simple/document-like) | Structured property records; Postgres preferred for relational amenities/media tables |
| Media Storage | Cloud object storage (e.g. S3 / Cloudinary) | Serve optimized images/gallery media to both web and app |
| Hosting | Vercel (website + API) | Fast deploys, preview URLs, good Next.js fit |
| App Distribution | Google Play Store + Apple App Store | Standard release process, no OTA/code-push required for v1 |

## 3. Data Model

### 3.1 `Property`
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | string | Property name |
| slug | string | URL-friendly identifier |
| location | string | City/area |
| latitude / longitude | float (optional) | For map display |
| status | enum | `upcoming` \| `ongoing` \| `completed` |
| short_description | text | Used on listing card |
| full_description | text | Used on detail page |
| external_website_url | string (optional) | Link to property's own dedicated site, if it exists |
| cover_image_url | string | Primary listing image |
| gallery_image_urls | string[] | Detail-page gallery |
| amenities | string[] | Simple tag list |
| display_order | integer | Controls listing order |
| is_published | boolean | Draft vs. live toggle |
| created_at / updated_at | timestamp | Audit fields |

### 3.2 `AppSettings` (singleton, optional)
| Field | Type | Notes |
|---|---|---|
| about_text | text | "About Raheja" content |
| brand_logo_url | string | Shared branding asset |
| contact_phone / contact_whatsapp | string | Static, non-form contact info shown in app footer/about (no form submission) |

## 4. API Endpoints (REST)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/properties` | List all published properties (id, name, cover image, location, status) |
| GET | `/api/properties/:slug` | Full detail for one property |
| GET | `/api/settings` | About/brand/contact info |

- All endpoints are public, read-only, unauthenticated (no login on the consumer side).
- A separate internal/admin-only write path exists for the dev team to ingest content (see §6) — not exposed publicly in v1.

## 5. App Architecture Notes

- React Native app fetches from the same `/api/properties` and `/api/properties/:slug` endpoints as the website — single source of truth, guaranteeing web/app parity.
- Standard app-store release cycle: app-shell/code changes go through Play Store/App Store review; property **content** changes require no app release since the app always reads live from the API.
- Basic client-side caching (e.g. last fetched property list stored locally) so the app has something to show if opened offline — not a hard requirement for v1.
- No push notifications, no deep linking requirement in v1 unless requested later.

## 6. Content Ingestion Pipeline (No Admin CMS in v1)

1. Raheja's team fills a shared Google Sheet/Doc template (one row per property, matching the `Property` fields above) and uploads media to a shared Drive folder.
2. Dev team runs an internal script/seed process (or manual DB entry) to map sheet rows + uploaded media into the `Property` table and object storage.
3. Website picks up changes on next deploy/ISR revalidation.
4. App picks up changes automatically on next API call — no app-store submission needed for content-only updates.
5. Backend `Property` table and API are designed so a lightweight admin panel (simple CRUD UI) can be layered on top later without any schema changes — this is a deliberate v2 upgrade path, not built now.

## 7. Non-Functional Requirements

- **Performance:** Listing and detail pages should load in <2s on average mobile connection; images served via CDN/optimized formats.
- **SEO:** Website must be server-rendered/statically generated for property pages (search visibility is part of the branding goal).
- **Availability:** Standard hosting SLA (Vercel/managed DB) — no custom uptime requirement specified.
- **Security:** No user data collected (no forms, no accounts), minimal attack surface. Internal ingestion path protected by basic auth/API key, not public.
- **Scalability:** Expected property count is small (tens, not thousands) — no special scaling design needed.

## 8. Out of Scope (Technical)

- Authentication/authorization for end users.
- Payment processing.
- Push notifications / OTA content sync mechanisms.
- Admin CMS UI (deferred to v2, but data layer supports it).
