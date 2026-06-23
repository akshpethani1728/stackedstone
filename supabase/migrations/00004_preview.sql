-- Stacked Stone — Preview Data Column
-- Migration 00004: Adds preview storage to books table

ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS preview_data JSONB,
  ADD COLUMN IF NOT EXISTS preview_generated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_books_has_preview
  ON public.books(id)
  WHERE preview_data IS NOT NULL;
