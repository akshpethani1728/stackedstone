# Stacked Stone — Product System

Re-architect the studio so the purchase journey feels like commissioning an object, not configuring one. The flow becomes:

**Destination → Edition → Cover → Material → Paper → Pages → Upload → Preview → Checkout**

Every step is a full editorial screen with one decision, beautiful imagery, and quiet copy — never a form.

## 1. Studio store (`src/lib/studio-store.ts`)

Expand `StudioState` to carry the new selections:

- `destination`, `edition` (existing)
- `cover` — `{ slug, name, mood, swatch, image }` from a per-destination cover collection
- `material` — `{ slug, name, feel, description }` (Classic, Linen, Matte, Soft-touch)
- `paper` — `{ slug, name, weight, finish, bestFor }` (Premium Matte, Silk, Lustre, Fine Art)
- `pageCount` — `{ pages, recommended:[min,max] }` (24 / 36 / 48 / 72)
- `extras` — `{ giftWrap, giftMessage, storageBox, extraCopy }`
- `photos` — uploaded files preview (data URLs kept in memory only)

Add curated catalogues exported from the store:
- `materials`, `papers`, `pageCounts`, `extras` (each priced as an upgrade delta)
- `coversFor(destinationSlug)` returning 3–4 designed covers per destination (Goa: Minimal Sand, Coastal Blue, Palm, Sunset; Japan: Sakura, Kyoto Stone, Tokyo Night, Minimal White; etc.). Reuse existing destination art with overlayed typographic treatments so each cover feels designed, not templated.

## 2. Step shell (`src/components/studio/StudioShell.tsx`)

New 8-step nav with serif numerals and tight uppercase labels:

```
01 Destination · 02 Edition · 03 Cover · 04 Material · 05 Paper · 06 Pages · 07 Photographs · 08 Preview
```

Checkout is reached from Preview, kept off the visible step rail to preserve "experience, not checkout" feel.

## 3. Route changes

| Route | Behaviour |
|---|---|
| `/destination` | Step 01. On select → `/create`. |
| `/create` | Step 02 (Edition). On select → `/cover`. |
| `/cover` (new) | Step 03. Shows the destination's cover collection in realistic book mockups (front cover, spine shadow, paper edge). On select → `/material`. |
| `/material` (new) | Step 04. Four large tactile cards with close-up texture imagery + emotional copy. → `/paper`. |
| `/paper` (new) | Step 05. Stock cards with weight, finish, "best for" descriptors and a close-up grain image. → `/pages`. |
| `/pages` (new) | Step 06. Four page-count cards; each shows its recommended photo range as a quiet caption. → `/upload`. |
| `/upload` | Step 07. Header now reads "Recommended: 35 · Minimum: 20 · Maximum: 45" pulled from selected page count, updating live as photos are added. → `/preview`. |
| `/preview` | Step 08. Large cover mockup composed from the **first uploaded photograph** placed inside the chosen cover frame (typographic overlay from cover design). Below: editorial spec block (Dimensions · Orientation · Paper · Binding · Cover · Estimated delivery · Printed in India). Optional extras shown as quiet "Add to your volume" toggles (Gift Wrap, Personal Note, Storage Box, Extra Copy). → `/checkout`. |
| `/checkout` | Order summary lists Edition, Destination, Cover, Material, Paper, Pages, Photographs, Extras, Shipping, Estimated delivery — all in elegant typography, no tables. |
| `/crafting` | Kept as the bridge animation after Checkout submit (already in place via `/success`); left untouched. |

CTAs across the site (`Hero`, `FeaturedCollection`, `Navigation`) point to `/destination` instead of `/create`.

## 4. Cover preview composition

`/cover` and `/preview` render a reusable `<BookMockup>` component:
- Stacked layers: paper edge → board → printed cover image → typographic overlay (destination name in Cormorant + author/year)
- Subtle inner shadow on the spine, soft cast shadow under the book
- On `/preview`, if a user-uploaded photo exists, it's used as the cover image; otherwise the destination's cover art

## 5. Extras

Presented on `/preview` as understated checkbox rows (no badges, no "save X%"), each with a small price delta. Selected extras propagate into the checkout summary and total.

## 6. Spec presentation

Specs render as a vertical editorial list (label in eyebrow, value in serif), never tabular. Used on `/preview` and inside the checkout summary.

## Technical notes

- All new screens reuse `StudioShell`, `container-edit`, `eyebrow`, `display`, `book-shadow`, `img-zoom`. No new design tokens.
- No new generated images this pass — covers/materials/papers compose from existing destination + texture art with typographic overlays and CSS treatments (paper grain via existing radial-gradient trick, linen via SVG noise, etc.) so the flow ships cohesively. We can swap in dedicated material/paper macro shots in a follow-up polish pass.
- Store remains client-only (`sessionStorage`); no backend.
- Each new route file follows the standard `createFileRoute` pattern with route-specific `head()` metadata.
- `routeTree.gen.ts` is regenerated automatically by the Vite plugin.

## Out of scope

- Real payment processing, real upload backend, real PDF preview rendering — the flow stays presentational, per the brief.
- New imagery generation (kept to a follow-up so this lands as one cohesive update).
