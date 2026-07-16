# User Flow
## Raheja Properties Showcase — Website & Mobile App

**Last Updated:** 2026-07-16

This document covers the end-user journey through the website and app. Since there are no accounts, forms, or transactions, the flow is intentionally simple: browse → view details → (optional) exit to external property site.

---

## 1. Website User Flow

```mermaid
flowchart TD
    A[Visitor lands on Website] --> B[Home Page]
    B --> C{Action}
    C -->|Browse Properties| D[Property Listing Page]
    C -->|Learn about Raheja| E[About Page]

    D --> F[Select a Property Card]
    F --> G[Property Detail Page]
    G --> H{Has External Website?}
    H -->|Yes| I[Click 'Visit Property Website']
    I --> J[Redirect to Property's Own Site - New Tab]
    H -->|No| K[Stay on Detail Page - View Gallery, Amenities, Location]

    G --> L[Back to Listing]
    L --> D
    E --> B
```

## 2. Mobile App User Flow

```mermaid
flowchart TD
    A[User Opens App] --> B[Splash Screen]
    B --> C[Home / Property Listing Screen]
    C --> D[Tap a Property Card]
    D --> E[Property Detail Screen]
    E --> F{Has External Website?}
    F -->|Yes| G[Tap 'Visit Website' Button]
    G --> H[Opens In-App Browser / External Browser]
    F -->|No| I[View Gallery, Description, Amenities, Map]
    E --> J[Back Button]
    J --> C
    C --> K[About Raheja Screen]
    K --> C
```

## 3. Key Screens / Pages Summary

| Screen/Page | Purpose | Key Elements |
|---|---|---|
| Home | First impression, brand intro | Hero banner, featured properties, nav to listing |
| Property Listing | Browse all properties | Grid/list of property cards (image, name, location, status tag) |
| Property Detail | Deep dive on one property | Gallery, description, amenities, map/location, status, external website link (if any) |
| About Raheja | Founder/brand story | Static content, contact phone/WhatsApp (no form) |

## 4. Explicit Non-Flows (v1)

- No login/signup flow.
- No "contact us" / inquiry form flow.
- No search/filter flow (deferred).
- No checkout/booking flow.
