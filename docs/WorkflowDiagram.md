# Workflow Diagram
## Raheja Properties Showcase — Website & Mobile App

**Last Updated:** 2026-07-16

This document ties together the system architecture and the content-update business process into one end-to-end view.

---

## 1. End-to-End System & Content Workflow

```mermaid
flowchart TD
    subgraph Content_Source["Content Source (Raheja's Team)"]
        A1[Fill Property Sheet/Doc Template]
        A2[Upload Images to Shared Drive]
    end

    subgraph Dev_Ingestion["Dev Team Ingestion"]
        B1[Review Submitted Data]
        B2[Map Fields into Database]
        B3[Upload Media to Object Storage]
    end

    subgraph Backend["Backend"]
        C1[(PostgreSQL - Properties/Settings)]
        C2[(Object Storage - Images)]
        C3[REST API]
    end

    subgraph Website["Website - Next.js"]
        D1[Home Page]
        D2[Property Listing Page]
        D3[Property Detail Page]
    end

    subgraph App["Mobile App - React Native"]
        E1[Listing Screen]
        E2[Detail Screen]
    end

    subgraph End_User["End User"]
        F1[Visitor Browses]
        F2[Optionally Visits External Property Website]
    end

    A1 --> B1
    A2 --> B1
    B1 --> B2
    B1 --> B3
    B2 --> C1
    B3 --> C2
    C1 --> C3
    C2 --> C3
    C3 --> D2
    C3 --> D3
    C3 --> E1
    C3 --> E2

    D1 --> D2 --> D3
    E1 --> E2

    D3 --> F1
    E2 --> F1
    F1 --> F2
```

## 2. App Release vs Content Update Workflow

```mermaid
flowchart LR
    Start([Change Needed]) --> Type{Type of Change?}
    Type -->|Property content: new/edit property, images, text| Content[Content Update Path]
    Type -->|App feature/UI/code change| Release[App Release Path]

    Content --> C1[Update via Sheet/Doc + Drive]
    C1 --> C2[Dev team ingests into DB]
    C2 --> C3[Website: redeploy/ISR revalidate]
    C2 --> C4[App: reflects instantly via API - no store update needed]

    Release --> R1[Dev builds new app version]
    R1 --> R2[Submit to Play Store / App Store]
    R2 --> R3[Store Review]
    R3 --> R4[Users update via standard app-store update]
```

## 3. Notes

- The two workflows above are intentionally decoupled: routine property updates (the common case) never require an app-store release.
- App-store releases are reserved for actual app-shell changes (new features, bug fixes, design changes).
- This keeps Raheja's showcase easy to keep current without ongoing app-store overhead.
