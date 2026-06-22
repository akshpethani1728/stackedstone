# Stacked Stone — Architecture

## Overview

Stacked Stone is a luxury travel photo-book commissioning service. The app is a **frontend-only TanStack Start + React 19 + TypeScript + Tailwind v4 + shadcn/ui** project, deployed on Vercel, with future plans for a **Supabase backend**.

---

## Folder Structure

```
src/
├── types/              # Shared TypeScript type definitions
│   ├── index.ts        # Re-exports all types
│   ├── studio.ts       # Frontend UI types (StudioState, Edition, Cover, etc.)
│   ├── destination.ts  # DestinationEntry (frontend)
│   └── database/       # Backend domain model types (14 entities)
│       ├── index.ts
│       ├── common.ts   # AuditTimestamps, SoftDeletable
│       ├── enums.ts    # BookStatus, OrderStatus, JobType, etc.
│       ├── users.ts    # User, AdminUser, Address
│       ├── catalogue.ts# Destination, BookEdition, CoverDesign, etc.
│       ├── books.ts    # Book, BookPhoto
│       ├── orders.ts   # Order, OrderItem
│       ├── jobs.ts     # Job
│       ├── notifications.ts
│       └── coupons.ts
│
├── data/               # Static data catalogues
│   ├── index.ts
│   ├── destinations.ts # 9 destinations
│   └── catalogue.ts    # Editions, covers, materials, papers, page counts
│
├── stores/             # State management
│   └── studio.ts       # useStudio() + sessionStorage persistence
│
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-studio.ts   # Re-exports from stores/
│
├── services/           # Data access layer (future: Supabase)
│   ├── index.ts
│   ├── destinations.service.ts
│   └── catalogue.service.ts
│
├── config/             # Runtime configuration
│   └── index.ts
│
├── lib/                # Pure utility functions
│   ├── utils.ts        # cn() helper
│   ├── pricing.ts      # Price calculations
│   ├── error-capture.ts
│   ├── error-page.ts
│   └── lovable-error-reporting.ts
│
├── components/         # UI components
│   ├── ui/             # 54 shadcn/ui primitives
│   ├── site/           # Marketing components
│   └── studio/         # Commissioning flow components
│
├── routes/             # TanStack file-based routing
├── router.tsx
├── server.ts
├── start.ts
├── styles.css
└── assets/
```

---

## Key Decisions

1. **Layers over features** — codebase split by concern (types, data, stores, services, lib, components, routes) not by feature silos. Keeps dependency graph acyclic.

2. **Types extracted** — shared types in `types/` with zero runtime code. Prevents circular deps.

3. **Static data separate from state** — catalogue data in `data/`, not mixed with React state.

4. **State is a thin hook** — `useStudio()` over `sessionStorage`. No Redux/Zustand. 57 lines.

5. **Business logic in pure functions** — pricing extracted to `lib/pricing.ts`, removing duplication across `preview.tsx` and `checkout.tsx`.

6. **Service layer as seam** — services/ wraps data/ behind query functions. When Supabase arrives, only services change.

7. **Config centralized** — studio steps, shipping cost, storage keys in `config/`.

8. **Database model separated from frontend types** — `types/database/` for backend domain, `types/studio.ts` for UI.
