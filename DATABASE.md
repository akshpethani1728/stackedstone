# Stacked Stone — Data Model

## Overview

This document defines the complete relational data model for Stacked Stone. Every entity, relationship, constraint, and lifecycle is documented here. The model is designed to support thousands of customers, future feature growth, and a clean migration path from the current client-only architecture to a Supabase-backed production system.

---

## Principles

1. **No binary blobs in the database.** Images are stored in Supabase Storage. The database holds only URLs and metadata.
2. **Soft deletes for business entities.** `deleted_at` preserves referential integrity and enables recovery.
3. **Audit timestamps everywhere.** Every entity has `created_at` and `updated_at`.
4. **Price snapshots for orders.** Catalogue prices may change, so order/book records capture the price at the time of purchase.
5. **Status-driven lifecycles.** Entities use typed enums, not boolean flags, for state transitions.
6. **IDs are UUIDs.** All primary keys use UUID v4 for distributed-safe, non-enumerable identifiers.

---

## Entity-Relationship Diagram (Textual)

```
User 1──N Address
User 1──N Book
User 1──N Order
User 1──N Notification
User 1──0..1 AdminUser

Book  N──1 Destination
Book  N──1 BookEdition
Book  N──1 CoverDesign
Book  N──1 BookMaterial
Book  N──1 PaperType
Book  N──1 PageCount
Book  1──N BookPhoto

Order 1──N OrderItem
Order N──1 Address
Order N──1 User

Destination N──N CoverDesign  (via destination_cover_designs)

Coupon (standalone, referenced by orders via coupon_id)
Job    (standalone, referenced by type + payload)
```

---

## Entity Definitions

### Users

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| email | TEXT | Unique, notifiable |
| name | TEXT | Display name |
| avatar_url | TEXT | Nullable — Supabase Storage URL |
| role | UserRole | customer \| admin \| super_admin |
| phone | TEXT | Nullable |
| email_verified_at | TIMESTAMPTZ | Nullable |
| last_sign_in_at | TIMESTAMPTZ | Nullable |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |
| deleted_at | TIMESTAMPTZ | Soft delete |

A user represents a customer or staff member. Roles are an enum for future admin scoping. The `email_verified_at` field supports email verification flows. Users own Books, Orders, Addresses, and Notifications.

**Relationships:**
- Has many Addresses (shipping/billing)
- Has many Books (commissioned volumes)
- Has many Orders (purchases)
- Has many Notifications
- Optionally has one AdminUser (if staff)

---

### AdminUsers

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → User.id |
| role | UserRole | admin \| super_admin |
| permissions | JSONB | Nullable — fine-grained access control |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |
| deleted_at | TIMESTAMPTZ | Soft delete |

A separate table (rather than a simple role flag on User) allows admin-specific metadata like granular permissions without bloating the User model. This is future-ready for an admin panel.

**Relationships:**
- Belongs to User

---

### Addresses

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → User.id |
| type | AddressType | shipping \| billing |
| line1 | TEXT | Street address |
| line2 | TEXT | Nullable — apartment, suite, etc. |
| city | TEXT | |
| state | TEXT | Nullable — not all countries have states |
| postal_code | TEXT | |
| country | TEXT | Full country name |
| is_default | BOOLEAN | Preferred address for checkout |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |
| deleted_at | TIMESTAMPTZ | Soft delete |

Addresses are owned by users and can be shipping or billing. The `is_default` flag simplifies checkout UX. Soft deletes allow users to remove addresses without breaking order history.

**Relationships:**
- Belongs to User
- Has many Orders (shipping address)

---

### Destinations

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| slug | TEXT | Unique — URL-safe identifier |
| name | TEXT | Display name (e.g. "Kashmir") |
| region | TEXT | e.g. "Himalayas" |
| country | TEXT | e.g. "India" |
| tagline | TEXT | Short poetic tagline |
| mood | TEXT | Atmospheric description |
| palette_bg | TEXT | CSS color — background |
| palette_ink | TEXT | CSS color — typography |
| palette_accent | TEXT | CSS color — accent |
| hero_url | TEXT | Supabase Storage URL |
| cover_url | TEXT | Supabase Storage URL |
| season | TEXT | e.g. "April – October" |
| category | DestinationCategory | Coastline \| Mountains \| Cities \| Deserts \| Backwaters \| Atlantic |
| published | BOOLEAN | Whether visible in the explorer |
| sort_order | INTEGER | Display ordering |
| stories | JSONB | Array of {eyebrow, title, body} |
| gallery | JSONB | Array of Storage URLs |
| pairings | JSONB | Array of destination slugs |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

Destinations are the thematic anchor of the product. Each destination has editorial content (stories, gallery images) that's always fetched together, stored as JSONB to avoid unnecessary joins for read-heavy catalogue queries.

**Why JSONB for stories/gallery/pairings?** These are value objects — they're always accessed with the destination, never queried independently. JSONB keeps the schema lean while allowing rich editorial content.

**Relationships:**
- Has many Covers (via destination_cover_designs junction)
- Referenced by Books

---

### BookEditions

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| slug | TEXT | Unique — weekend \| journey \| explorer \| collector |
| name | TEXT | e.g. "Weekend Edition" |
| pages_min | INTEGER | Minimum page count for this edition |
| pages_max | INTEGER | Maximum page count for this edition |
| size_label | TEXT | e.g. "8 × 10 in" |
| base_price | INTEGER | Base price in USD |
| ideal_for | TEXT | Editorial description of use case |
| photo_estimate_min | INTEGER | Recommended minimum photos |
| photo_estimate_max | INTEGER | Recommended maximum photos |
| description | TEXT | Full editorial description |
| is_active | BOOLEAN | Whether available for new commissions |
| sort_order | INTEGER | Display ordering |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

Editions define the size, page range, and base price of a book. Active/inactive flag allows retiring editions without deleting historical data.

**Relationships:**
- Referenced by Books

---

### CoverDesigns

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| slug | TEXT | Unique within context |
| name | TEXT | e.g. "Minimal Sand" |
| mood | TEXT | Atmospheric description |
| ink_color | TEXT | CSS color for typography |
| panel_color | TEXT | CSS color for overlay panel (rgba) |
| image_url | TEXT | Supabase Storage URL |
| is_active | BOOLEAN | Whether available |
| sort_order | INTEGER | Display ordering |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

Cover designs are reusable visual treatments. The many-to-many relationship with Destinations via `destination_cover_designs` allows curated cover collections per destination.

**Relationships:**
- Has many Destinations (via destination_cover_designs junction)
- Referenced by Books

---

### DestinationCoverDesigns (Junction Table)

| Column | Type | Notes |
|---|---|---|
| destination_id | UUID | FK → Destination.id |
| cover_design_id | UUID | FK → CoverDesign.id |
| sort_order | INTEGER | Cover ordering within destination |

Composite PK: (destination_id, cover_design_id). Maps the current `coverCollections` data structure to normalized relational form.

---

### BookMaterials

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| slug | TEXT | Unique — classic \| linen \| matte \| soft-touch |
| name | TEXT | e.g. "Classic Hardcover" |
| feel | TEXT | Tactile description |
| description | TEXT | Editorial description |
| price_delta | INTEGER | Additional cost over base (USD) |
| swatch_color | TEXT | CSS color for UI swatch |
| texture_url | TEXT | Texture image for UI preview |
| is_active | BOOLEAN | Whether available |
| sort_order | INTEGER | Display ordering |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

**Relationships:**
- Referenced by Books

---

### PaperTypes

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| slug | TEXT | Unique — premium-matte \| silk \| lustre \| fine-art |
| name | TEXT | e.g. "Premium Matte" |
| weight | TEXT | e.g. "170 gsm" |
| finish | TEXT | e.g. "Smooth, low-glare" |
| best_for | TEXT | Photographic guidance |
| price_delta | INTEGER | Additional cost (USD) |
| texture_url | TEXT | Texture image for UI preview |
| is_active | BOOLEAN | Whether available |
| sort_order | INTEGER | Display ordering |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

**Relationships:**
- Referenced by Books

---

### PageCounts

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| pages | INTEGER | Number of pages |
| label | TEXT | e.g. "24 pages" |
| recommended_min | INTEGER | Minimum photos recommended |
| recommended_max | INTEGER | Maximum photos recommended |
| ideal_for | TEXT | Editorial use-case description |
| price_delta | INTEGER | Additional cost (USD) |
| is_active | BOOLEAN | Whether available |
| sort_order | INTEGER | Display ordering |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

**Relationships:**
- Referenced by Books

---

### Books

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → User.id |
| destination_id | UUID | Nullable FK → Destination.id |
| edition_id | UUID | Nullable FK → BookEdition.id |
| cover_design_id | UUID | Nullable FK → CoverDesign.id |
| material_id | UUID | Nullable FK → BookMaterial.id |
| paper_type_id | UUID | Nullable FK → PaperType.id |
| page_count_id | UUID | Nullable FK → PageCount.id |
| title | TEXT | Nullable — user-provided title |
| status | BookStatus | Current lifecycle state |
| extras | JSONB | `{gift_wrap, gift_message, storage_box, extra_copy}` |
| price_breakdown | JSONB | Snapshot of all price components at creation |
| total_price | INTEGER | Total price in USD (nullable until finalized) |
| photo_count | INTEGER | Number of photos uploaded |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |
| deleted_at | TIMESTAMPTZ | Soft delete |

Books are the core entity — a user's commissioned volume. All configuration choices are nullable until the user completes the corresponding step. The `price_breakdown` JSONB captures a snapshot of the price components at the time the book is created/ordered, protecting against catalogue price changes.

**Price Breakdown Structure:**
```json
{
  "edition_price": 149,
  "material_delta": 24,
  "paper_delta": 0,
  "page_count_delta": 14,
  "extras": {
    "total": 50,
    "items": [
      { "slug": "storageBox", "name": "Premium storage box", "price": 38 },
      { "slug": "giftWrap", "name": "Gift wrapping", "price": 12 }
    ]
  }
}
```

**Book Lifecycle:**
```
Draft ──→ Uploading ──→ Generating ──→ PreviewReady ──→ Ordered ──→ Printing
                                                                        │
                                                                        ↓
                                                                   QualityCheck
                                                                        │
                                                                        ↓
                                                                     Packed
                                                                        │
                                                                        ↓
                                                                     Shipped
                                                                        │
                                                                        ↓
                                                                   Delivered
                                                                        │
                                                                        ↓
                                                                   Archived
```

The status enum enforces this flow. A book in "PreviewReady" cannot jump directly to "Shipped" — it must go through "Ordered" first. This prevents invalid state transitions.

**Relationships:**
- Belongs to User
- Belongs to Destination (nullable until step 1)
- Belongs to BookEdition (nullable until step 2)
- Belongs to CoverDesign (nullable until step 3)
- Belongs to BookMaterial (nullable until step 4)
- Belongs to PaperType (nullable until step 5)
- Belongs to PageCount (nullable until step 6)
- Has many BookPhotos
- Has one Order (when purchased)

---

### BookPhotos

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| book_id | UUID | FK → Book.id |
| storage_url | TEXT | Supabase Storage URL |
| thumbnail_url | TEXT | Nullable — generated thumbnail |
| sort_order | INTEGER | Display order within the book |
| width | INTEGER | Nullable — original image width |
| height | INTEGER | Nullable — original image height |
| file_size_bytes | INTEGER | Nullable |
| created_at | TIMESTAMPTZ | Auto |

No binary data is stored in the database. Only metadata and Storage URLs. Thumbnails are generated asynchronously via the Jobs system.

**Relationships:**
- Belongs to Book

---

### Orders

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → User.id |
| address_id | UUID | FK → Address.id |
| order_number | TEXT | Unique — human-readable (e.g. "SS-A7X3K") |
| status | OrderStatus | pending \| confirmed \| processing \| shipped \| delivered \| cancelled \| refunded |
| subtotal | INTEGER | Sum of item prices (USD) |
| shipping_cost | INTEGER | Shipping charge (USD) |
| total | INTEGER | Grand total (USD) |
| currency | TEXT | ISO 4217 — "USD" |
| notes | TEXT | Nullable — customer or staff notes |
| paid_at | TIMESTAMPTZ | Nullable — when payment was confirmed |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

Orders are created when a Book transitions from PreviewReady to Ordered. The financial fields store the final amounts in USD cents (integer) to avoid floating-point issues.

**Relationships:**
- Belongs to User
- Belongs to Address (shipping address at time of order)
- Has many OrderItems

---

### OrderItems

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| order_id | UUID | FK → Order.id |
| book_id | UUID | Nullable FK → Book.id |
| item_type | TEXT | "book" \| "extra_copy" \| "gift_wrap" \| "storage_box" |
| name | TEXT | Human-readable item name |
| quantity | INTEGER | Number of units |
| unit_price | INTEGER | Price per unit (USD) |
| total_price | INTEGER | quantity × unit_price (USD) |
| created_at | TIMESTAMPTZ | Auto |

OrderItems provide a detailed line-item breakdown of each order. Currently, an order contains one book plus optional extras. This structure also supports future bundle sales or multi-volume orders.

**Relationships:**
- Belongs to Order
- Optionally belongs to Book

---

### Jobs

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| type | JobType | upload_images \| generate_preview \| generate_pdf \| send_email \| generate_thumbnail \| sync_order |
| status | JobStatus | pending \| processing \| completed \| failed \| cancelled |
| payload | JSONB | Type-specific input data |
| result | JSONB | Nullable — type-specific output data |
| error_message | TEXT | Nullable — failure reason |
| attempts | INTEGER | Current attempt count |
| max_attempts | INTEGER | Maximum retry attempts |
| scheduled_for | TIMESTAMPTZ | Nullable — future scheduling |
| started_at | TIMESTAMPTZ | Nullable |
| completed_at | TIMESTAMPTZ | Nullable |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |

The Jobs entity is a generic, reusable queue system. Every background process creates a job record. The payload/result JSONB allows any job type to store its specific data without schema changes.

**Example payloads:**

| Job Type | Payload |
|---|---|
| generate_preview | `{ "book_id": "uuid", "cover_id": "uuid", "photos": [...] }` |
| send_email | `{ "to": "user@example.com", "template": "order_confirmation", "data": {...} }` |
| sync_order | `{ "order_id": "uuid", "target": "print_provider" }` |

**Job Lifecycle:**
```
Pending ──→ Processing ──→ Completed
               │
               ↓
            Failed ──→ Pending (retry)
               │
               ↓
           Cancelled
```

---

### Notifications

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → User.id |
| type | NotificationType | order_confirmation \| shipping_update \| delivery_confirmation \| promotional \| job_failed |
| channel | NotificationChannel | email \| in_app |
| subject | TEXT | Notification subject/title |
| body | TEXT | Notification body (plain text or markdown) |
| data | JSONB | Nullable — structured data for rendering |
| read_at | TIMESTAMPTZ | Nullable — when user read it |
| sent_at | TIMESTAMPTZ | Nullable — when it was sent |
| created_at | TIMESTAMPTZ | Auto |

Notifications support both email and in-app delivery. The `data` JSONB contains structured information for rich rendering (e.g., order number, tracking URL). The `read_at` / `sent_at` nullability supports draft, unsent, and unread states.

---

### Coupons

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| code | TEXT | Unique — user-facing coupon code |
| discount_type | DiscountType | percentage \| fixed_amount |
| discount_value | INTEGER | Percentage (0-100) or fixed amount in USD cents |
| min_order_amount | INTEGER | Nullable — minimum order total to apply |
| max_uses | INTEGER | Nullable — global usage limit |
| used_count | INTEGER | Current usage count |
| max_uses_per_user | INTEGER | Nullable — per-user limit |
| is_active | BOOLEAN | Whether the coupon is accepting new uses |
| expires_at | TIMESTAMPTZ | Nullable — expiration date |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto |
| deleted_at | TIMESTAMPTZ | Soft delete |

Coupons support percentage and fixed-amount discounts with usage limits, minimum order thresholds, and expiration. Soft delete allows disabling without breaking historical references.

---

## Enums Summary

| Enum | Values | Applicable Entities |
|---|---|---|
| UserRole | customer, admin, super_admin | User, AdminUser |
| AddressType | shipping, billing | Address |
| BookStatus | draft, uploading, generating, preview_ready, ordered, printing, quality_check, packed, shipped, delivered, archived | Book |
| OrderStatus | pending, confirmed, processing, shipped, delivered, cancelled, refunded | Order |
| JobType | upload_images, generate_preview, generate_pdf, send_email, generate_thumbnail, sync_order | Job |
| JobStatus | pending, processing, completed, failed, cancelled | Job |
| NotificationChannel | email, in_app | Notification |
| NotificationType | order_confirmation, shipping_update, delivery_confirmation, promotional, job_failed | Notification |
| DiscountType | percentage, fixed_amount | Coupon |
| DestinationCategory | Coastline, Mountains, Cities, Deserts, Backwaters, Atlantic | Destination |

---

## TypeScript Implementation

All types live in `src/types/database/`:

```
types/database/
├── index.ts          # Re-exports
├── common.ts         # AuditTimestamps, SoftDeletable
├── enums.ts          # All enums
├── users.ts          # User, AdminUser, Address
├── catalogue.ts      # Destination, BookEdition, CoverDesign, BookMaterial, PaperType, PageCount, DestinationCoverDesign
├── books.ts          # Book, BookPhoto, BookExtras, PriceBreakdown
├── orders.ts         # Order, OrderItem
├── jobs.ts           # Job
├── notifications.ts  # Notification
└── coupons.ts        # Coupon
```

These types are re-exported from `src/types/index.ts` via `export * from "./database"`, making them available as `import type { Book } from "@/types"`.

The database types are separate from the frontend UI types (`types/studio.ts`, `types/destination.ts`). They represent the backend domain model and will eventually be generated from Supabase's `supabase gen types` command.

---

## Implementation Status

### ✅ Completed (Phase 3)
- **Schema migrated** — all 14 tables, 10 enums, 16 relationships, indexes, triggers in `supabase/migrations/00001_schema.sql`
- **Storage buckets created** — 6 buckets (`book-images`, `book-previews`, `covers`, `destination-assets`, `thumbnails`, `avatars`) in `00002_storage.sql`
- **RLS enabled** — 30+ policies across all tables and storage buckets in `00003_rls.sql`
- **Auth configured** — Supabase Auth with email + Google (future-ready), sync trigger from `auth.users` to `public.users`
- **Seed data ready** — `supabase/seed.sql` with editions, materials, papers, page counts
- **Supabase client library** — `src/lib/supabase/` with browser, SSR, and service-role clients
- **Service layer** — 7 service skeletons (`BookService`, `StorageService`, `OrderService`, `UploadService`, `NotificationService`, `AuthService`, `DestinationService`)
- **Validation schemas** — Zod schemas for books, orders, addresses, users, uploads
- **Error handling** — centralized `AppError` system with typed error codes and Supabase error mapping
- **Logging** — structured logger with levels, context, and timestamp
- **Configuration** — all env vars, constants, limits, feature flags in `config/index.ts`
- **Auth middleware** — server-side route protection via `auth-middleware.ts`
- **Router context** — extended with `user` and `session` for route-level auth
- **Documentation** — ARCHITECTURE.md and DATABASE.md updated

### 🔜 Phase 4 (next): State & Orders
- `useStudio()` persists to Supabase instead of sessionStorage
- Checkout creates real Order + OrderItem + Book records
- Payment integration triggers job creation

### 🔜 Phase 5 (future): Jobs & Notifications
- Background workers process Job queue
- Notification records sent via email provider
