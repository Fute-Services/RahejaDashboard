# Product Requirements Document (PRD)
## Raheja Properties Showcase — Website & Mobile App

**Client:** Raheja (Founder)
**Document Owner:** Dev Team
**Last Updated:** 2026-07-16

---

## 1. Background & Purpose

Raheja wants a simple, elegant showcase of all his properties — a single place where visitors can browse the full portfolio, view details of each property, and (where available) jump to that property's own dedicated website. This is a **branding/showcase product**, not a lead-generation or sales tool. There are no contact forms, no CRM, and no lead capture in v1.

The showcase will exist in two forms sharing the same content and backend:
- A **public website** (primary, SEO-visible)
- A **cross-platform mobile app** (iOS + Android, React Native)

## 2. Goals

- Present Raheja's full property portfolio in one clean, professional showcase.
- Let visitors view key details of each property (images, description, location, amenities, status) without leaving the platform.
- Let visitors optionally continue to a property's own external website, if one exists, for deeper information.
- Keep the experience simple — no accounts, no forms, no transactional flows.
- Ship an app and website that share the same property data and stay in sync.

## 3. Non-Goals (v1)

- No lead capture / contact forms / inquiry forms.
- No CRM or sales-pipeline integration.
- No admin/CMS panel for Raheja's team to self-edit content (content updates go through the dev team — see §7).
- No user accounts, login, or personalization.
- No payments or booking.

## 4. Target Users

- Prospective buyers/investors researching Raheja's portfolio.
- Partners, brokers, or media who want a quick, credible overview of all properties.
- Raheja himself, using it as a branding asset to share (e.g. a link/app to hand out).

## 5. Scope — Features

### 5.1 Website (Public)
- Home / landing page with brand intro and featured properties.
- Property listing/grid page — all properties, showcase style (image, name, location, status tag).
- Property detail page — gallery, description, location/map, amenities, status (ongoing/completed/upcoming), and an "Visit Property Website" link/button if the property has its own site.
- Basic "About Raheja" page.
- Responsive design (mobile web + desktop).
- No forms, no login, no search filters required for v1 (may be considered later, not in scope now).

### 5.2 Mobile App (iOS + Android)
- Same content and structure as the website: property listing + property detail screens.
- Native app shell (React Native) consuming the same backend API as the website.
- Standard app-store distribution: updates go through Play Store / App Store review and release — no in-app OTA content sync or forced-update mechanism required for v1.
- Offline-friendly basic caching of last-loaded property list (nice-to-have, not required for v1).

### 5.3 Content Management (v1 approach)
- No admin panel in v1. Raheja's team submits new/updated property info via a shared Google Sheet/Doc template + a shared Drive folder for images/media.
- Dev team ingests this data, updates the backend/data source, and redeploys the website; app content updates automatically since it reads from the same API (no app rebuild needed for content changes — only for app-shell/feature changes).
- Backend is structured so a lightweight admin CMS can be added later without a rearchitecture (see TRD).

## 6. Success Criteria

- All of Raheja's current properties are visible and correctly represented on both website and app.
- Property detail pages load correctly with images, description, and external website link where applicable.
- Website and app show identical, in-sync property data at all times (single source of truth via shared API).
- Content updates (new property, edited details) can go live on the website within one dev cycle without any app-store release needed.

## 7. Content Update Workflow (Business Process)

1. Raheja's team fills in the shared property template (Sheet/Doc) with property details and drops media into the shared Drive folder.
2. Dev team reviews the submission, maps it into the backend data store.
3. Website reflects the change immediately on next deploy; app reflects it automatically on next app launch/data refresh (no app-store update required for content-only changes).
4. App-store updates are only needed when the app's code/features change, not for routine property content changes.

## 8. Assumptions & Constraints

- Not every property will have its own external website — the link is optional per property.
- No multi-language support required for v1 unless specified later.
- No analytics/tracking requirements specified for v1 (can be added later — e.g. simple page-view counts).
- Branding assets (logo, colors, fonts) to be provided by Raheja's team.

## 9. Open Items for Future Phases (explicitly out of scope now)

- Lead capture / contact forms.
- Admin CMS for self-service content editing.
- Search & filter on the listing page.
- Multi-language support.
- Analytics dashboard for Raheja.
