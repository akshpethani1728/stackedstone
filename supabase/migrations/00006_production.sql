-- ===================== MIGRATION 00006: PRODUCTION ENGINE =====================

-- 1. Extend enums
ALTER TYPE job_type ADD VALUE IF NOT EXISTS 'generate_cover';
ALTER TYPE job_type ADD VALUE IF NOT EXISTS 'optimize_images';
ALTER TYPE job_type ADD VALUE IF NOT EXISTS 'prepare_print_files';

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'preparing_files';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'print_ready';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'ready_to_ship';

ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'order_paid';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'pdf_ready';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'printing_started';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'packed';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ready_to_ship_update';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'shipped_update';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'delivered_update';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'job_completed';

-- 2. Assets table — tracks all generated files
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  asset_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  dpi INTEGER DEFAULT 300,
  version INTEGER NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_book_id ON public.assets(book_id);
CREATE INDEX IF NOT EXISTS idx_assets_order_id ON public.assets(order_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON public.assets(asset_type);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Assets readable by book owners" ON public.assets;
CREATE POLICY "Assets readable by book owners" ON public.assets
  FOR SELECT USING (
    book_id IN (SELECT id FROM public.books WHERE user_id = auth.uid())
    OR
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

-- 3. Shipping details
CREATE TABLE IF NOT EXISTS public.shipping_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  courier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  label_url TEXT,
  manifest_url TEXT,
  weight_grams INTEGER,
  length_cm NUMERIC(6,2),
  width_cm NUMERIC(6,2),
  height_cm NUMERIC(6,2),
  package_count INTEGER NOT NULL DEFAULT 1,
  shipped_at TIMESTAMPTZ,
  estimated_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipping_order_id ON public.shipping_details(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_tracking ON public.shipping_details(tracking_number);

ALTER TABLE public.shipping_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shipping readable by order owners" ON public.shipping_details;
CREATE POLICY "Shipping readable by order owners" ON public.shipping_details
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

-- 4. Notification events — log of what happened (not user-facing notifications)
CREATE TABLE IF NOT EXISTS public.notification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  channel notification_channel NOT NULL DEFAULT 'in_app',
  subject TEXT,
  body TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_events_user ON public.notification_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_events_order ON public.notification_events(order_id);
CREATE INDEX IF NOT EXISTS idx_notif_events_type ON public.notification_events(event_type);

ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notification events" ON public.notification_events;
CREATE POLICY "Users can view own notification events" ON public.notification_events
  FOR SELECT USING (user_id = auth.uid());

-- 5. Add production metadata to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS production_step TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS production_started_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS print_ready_at TIMESTAMPTZ;

-- 6. Trigger for shipping_details updated_at
DROP TRIGGER IF EXISTS update_shipping_details_updated_at ON public.shipping_details;
CREATE TRIGGER update_shipping_details_updated_at BEFORE UPDATE ON public.shipping_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. Function to advance order production status
CREATE OR REPLACE FUNCTION public.advance_production_status(
  p_order_id UUID,
  p_status order_status,
  p_production_step TEXT DEFAULT NULL
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order public.orders;
BEGIN
  UPDATE public.orders
  SET
    status = p_status,
    production_step = COALESCE(p_production_step, production_step),
    production_started_at = CASE WHEN p_status = 'preparing_files' AND production_started_at IS NULL THEN now() ELSE production_started_at END,
    print_ready_at = CASE WHEN p_status = 'print_ready' THEN now() ELSE print_ready_at END,
    updated_at = now()
  WHERE id = p_order_id
  RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

-- 8. Function to claim next pending job (used by JobService)
CREATE OR REPLACE FUNCTION public.claim_next_job()
RETURNS public.jobs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_job public.jobs;
BEGIN
  SELECT * INTO v_job
  FROM public.jobs
  WHERE status = 'pending'
    AND (scheduled_for IS NULL OR scheduled_for <= now())
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_job.id IS NOT NULL THEN
    UPDATE public.jobs
    SET status = 'processing', started_at = now(), attempts = attempts + 1
    WHERE id = v_job.id;
    v_job.status := 'processing';
    v_job.started_at := now();
  END IF;

  RETURN v_job;
END;
$$;

-- 9. Function to increment a value (for job attempts)
CREATE OR REPLACE FUNCTION public.increment(x INTEGER)
RETURNS INTEGER
LANGUAGE sql
AS $$ SELECT x + 1; $$;

-- 10. Storage buckets — created via management API at setup time; these are the canonical names
-- print-pdfs, covers, thumbnails, preview-images, exports
