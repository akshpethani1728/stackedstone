-- Stacked Stone — Storage Buckets
-- Migration 00002: Create storage buckets and folder conventions

-- ===================== BUCKETS =====================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('book-images', 'book-images', false, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/tiff']),
  ('book-previews', 'book-previews', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('covers', 'covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('destination-assets', 'destination-assets', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('thumbnails', 'thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ===================== FOLDER CONVENTIONS =====================
--
-- book-images/{userId}/{bookId}/{photo-uuid}.{ext}
--   - Original user-uploaded photographs
--   - Private per user/book
--
-- book-previews/{bookId}/preview.pdf
-- book-previews/{bookId}/thumbnails/{sort_order}.jpg
--   - Generated preview PDFs and thumbnail images
--   - Public (shared for preview)
--
-- covers/{design-slug}.{ext}
--   - Cover design artwork (studio-managed)
--   - Public
--
-- destination-assets/{slug}/{file}.{ext}
--   - Destination hero, gallery images (studio-managed)
--   - Public
--
-- thumbnails/{entity}/{id}.{ext}
--   - Auto-generated thumbnails for various entities
--   - Public
--
-- avatars/{userId}/{filename}.{ext}
--   - User profile pictures
--   - Public
