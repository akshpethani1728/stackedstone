# Stacked Stone — Architecture

## Overview

Stacked Stone is a luxury travel photo-book commissioning service. The app uses **TanStack Start + React 19 + TypeScript + Tailwind v4 + shadcn/ui** for its frontend, **Vercel** for hosting, and **Supabase** as its backend platform (auth, database, storage, RLS).

---

## Folder Structure

```
stackedstone/
├── .env.example           # Environment variable template
├── .env                   # Local environment (gitignored)
├── supabase/
│   ├── migrations/        # Database migration files (versioned)
│   │   ├── 00001_schema.sql   # Core schema: all tables, enums, triggers, indexes
│   │   ├── 00002_storage.sql  # Storage buckets and folder conventions
│   │   └── 00003_rls.sql      # Row Level Security policies
│   └── seed.sql           # Seed data for catalogue (editions, materials, papers, page counts)
│
├── src/
│   ├── types/             # Shared TypeScript type definitions
│   │   ├── index.ts       # Re-exports all types
│   │   ├── studio.ts      # Frontend UI types (StudioState, Edition, Cover, etc.)
│   │   ├── destination.ts # DestinationEntry (frontend)
│   │   └── database/      # Backend domain model types (14 entities)
│   │       ├── index.ts
│   │       ├── common.ts
│   │       ├── enums.ts
│   │       ├── users.ts
│   │       ├── catalogue.ts
│   │       ├── books.ts
│   │       ├── orders.ts
│   │       ├── jobs.ts
│   │       ├── notifications.ts
│   │       └── coupons.ts
│   │
│   ├── data/              # Static data catalogues (client-only fallback)
│   │   ├── index.ts
│   │   ├── destinations.ts
│   │   └── catalogue.ts
│   │
│   ├── stores/            # State management
│   │   └── studio.ts      # useStudio() + sessionStorage persistence
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-studio.ts
│   │
│   ├── services/          # Data access layer (Supabase-backed)
│   │   ├── index.ts           # Barrel re-exports
│   │   ├── book.service.ts    # Book CRUD
│   │   ├── storage.service.ts # File upload/download
│   │   ├── order.service.ts   # Order management
│   │   ├── upload.service.ts  # Book photo management
│   │   ├── notification.service.ts
│   │   ├── auth.service.ts    # Authentication helpers
│   │   └── destination.service.ts
│   │
│   ├── config/            # Runtime configuration
│   │   └── index.ts       # All constants, env vars, feature flags, limits
│   │
│   ├── lib/
│   │   ├── supabase/          # Supabase client library
│   │   │   ├── index.ts       # Re-exports
│   │   │   ├── client.ts      # Browser client factory
│   │   │   ├── server.ts      # SSR + service role clients
│   │   │   └── types.ts       # Database type definitions (mirrors schema)
│   │   ├── errors/            # Centralized error handling
│   │   │   └── index.ts       # AppError, subclasses, error formatting
│   │   ├── validations/       # Zod schemas
│   │   │   ├── index.ts       # Re-exports
│   │   │   ├── book.ts        # Book + extras schemas
│   │   │   ├── order.ts       # Order + order item schemas
│   │   │   ├── address.ts     # Address schema
│   │   │   ├── user.ts        # User profile schema
│   │   │   └── upload.ts      # Upload validation
│   │   ├── auth-middleware.ts  # Server-side auth guards
│   │   ├── logger.ts          # Structured logging utility
│   │   ├── utils.ts           # cn() helper
│   │   ├── pricing.ts         # Price calculations
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   └── lovable-error-reporting.ts
│   │
│   ├── components/        # UI components
│   │   ├── ui/            # 54 shadcn/ui primitives
│   │   ├── site/          # Marketing components
│   │   └── studio/        # Commissioning flow components
│   │
│   ├── routes/            # TanStack file-based routing
│   ├── router.tsx         # Router with auth context
│   ├── server.ts          # SSR entry with error wrapping
│   ├── start.ts           # TanStack Start instance
│   ├── styles.css
│   └── assets/
└── package.json           # Dependencies including @supabase/supabase-js, @supabase/ssr
```

---

## Key Decisions

### Architecture (unchanged from Phase 2)
1. **Layers over features** — codebase split by concern, not feature silos. Keeps dependency graph acyclic.
2. **Types extracted** — shared types in `types/` with zero runtime code. Prevents circular deps.
3. **Static data separate from state** — catalogue data in `data/`, not mixed with React state.
4. **State is a thin hook** — `useStudio()` over `sessionStorage`. No Redux/Zustand.
5. **Business logic in pure functions** — pricing extracted to `lib/pricing.ts`.
6. **Service layer as seam** — services wrap Supabase behind query functions. Easy to test and swap.
7. **Config centralized** — all env vars, constants, feature flags in `config/`.
8. **Database model separated from frontend types** — `types/database/` for backend, `types/studio.ts` for UI.

### Supabase Client Architecture
- **`client.ts`** — browser-side singleton using `@supabase/ssr`'s `createBrowserClient`. Used in route components and service calls.
- **`server.ts`** — SSR client using `createServerClient` with cookie-based auth via `vinxi/http`. Also exposes `getSupabaseServiceClient()` with the service role key for admin operations (server-only).
- **`types.ts`** — manually maintained `Database` interface matching the full schema. Run `supabase gen types typescript --linked > src/lib/supabase/types.ts` to auto-generate.

### Error Handling
- **`AppError`** base class with typed error codes and HTTP status codes.
- **Subclasses**: `ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `DatabaseError`, `StorageError`.
- **`fromSupabaseError()`** maps common Supabase/Postgres error messages to typed AppErrors.
- **`formatError()`** produces a safe serializable error object for API responses.

### Validation
- All Zod schemas live in `src/lib/validations/`.
- Schemas define input types separately from database types.
- Validation is used in service methods but not tied to UI components yet.

### Authentication
- Supabase Auth configured for email + Google (future-ready) + anonymous (future-ready).
- `AuthService` provides `requireAuth()` and `getUser()` helpers.
- `auth-middleware.ts` provides server-side route protection for SSR.
- Router context extended with `user` and `session` for route-level auth checks.
- Auth is not wired into UI yet (feature flag: `enableAuth: false`).

### Row Level Security
- RLS enabled on all 17 tables.
- **Public read**: catalogue tables (destinations, editions, covers, materials, papers, page counts).
- **User-owned**: users can CRUD their own books, addresses, photos, orders, notifications.
- **Admin-only**: all tables have admin policies via `admin_users` membership.
- **Storage RLS**: book-images scoped per-user; covers, destination-assets, thumbnails, avatars public-read.

### Database Migrations
- Three migration files in `supabase/migrations/`:
  1. `00001_schema.sql` — all tables, enums, indexes, relationships, triggers (`updated_at` auto-update, `auth.users` sync)
  2. `00002_storage.sql` — six storage buckets with folder convention documentation
  3. `00003_rls.sql` — RLS policies for all tables and storage buckets
- `seed.sql` populates catalogue data (editions, materials, papers, page counts).
- Run with `supabase db push` or through the Supabase Dashboard SQL editor.

### Feature Flags
All features guarded by `config.featureFlags`:
- `enableCheckout: false` — checkout flow not wired to Supabase yet
- `enableUpload: false` — upload flow not wired yet
- `enableAuth: false` — auth UI not built yet
- `enableAdminPanel: false` — admin features not built yet

Setting a flag to `true` in config enables the corresponding feature across the app.
