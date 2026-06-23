-- ===================== MIGRATION 00007: STORAGE BUCKETS & RLS FIXES =====================

-- 1. Create missing storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('print-pdfs', 'print-pdfs', false, 104857600, ARRAY['application/pdf']),
  ('preview-images', 'preview-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('exports', 'exports', true, 104857600, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for print-pdfs (admin write, order-owner read)
DROP POLICY IF EXISTS "Print PDFs readable by order owners" ON storage.objects;
CREATE POLICY "Print PDFs readable by order owners" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'print-pdfs'
    AND (
      EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
      OR EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id::text = (storage.foldername(name))[2]
          AND orders.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Admins manage print PDFs" ON storage.objects;
CREATE POLICY "Admins manage print PDFs" ON storage.objects
  FOR ALL USING (
    bucket_id = 'print-pdfs'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

-- Storage RLS for preview-images (public read, admin write)
DROP POLICY IF EXISTS "Public read preview images" ON storage.objects;
CREATE POLICY "Public read preview images" ON storage.objects
  FOR SELECT USING (bucket_id = 'preview-images');

DROP POLICY IF EXISTS "Admins manage preview images" ON storage.objects;
CREATE POLICY "Admins manage preview images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'preview-images'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

-- Storage RLS for exports (order-owner read, admin write)
DROP POLICY IF EXISTS "Exports readable by order owners" ON storage.objects;
CREATE POLICY "Exports readable by order owners" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'exports'
    AND (
      EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
      OR EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id::text = (storage.foldername(name))[2]
          AND orders.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Admins manage exports" ON storage.objects;
CREATE POLICY "Admins manage exports" ON storage.objects
  FOR ALL USING (
    bucket_id = 'exports'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

-- 2. RLS for assets — allow INSERT/UPDATE for book owners
DROP POLICY IF EXISTS "Book owners can insert assets" ON public.assets;
CREATE POLICY "Book owners can insert assets" ON public.assets
  FOR INSERT WITH CHECK (
    book_id IN (SELECT id FROM public.books WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Book owners can update assets" ON public.assets;
CREATE POLICY "Book owners can update assets" ON public.assets
  FOR UPDATE USING (
    book_id IN (SELECT id FROM public.books WHERE user_id = auth.uid())
  );

-- 3. RLS for shipping_details — allow INSERT/UPDATE for order owners
DROP POLICY IF EXISTS "Order owners can insert shipping" ON public.shipping_details;
CREATE POLICY "Order owners can insert shipping" ON public.shipping_details
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Order owners can update shipping" ON public.shipping_details;
CREATE POLICY "Order owners can update shipping" ON public.shipping_details
  FOR UPDATE USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

-- 4. RLS for notification_events — allow INSERT/UPDATE for own events
DROP POLICY IF EXISTS "Users can insert own notification events" ON public.notification_events;
CREATE POLICY "Users can insert own notification events" ON public.notification_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notification events" ON public.notification_events;
CREATE POLICY "Users can update own notification events" ON public.notification_events
  FOR UPDATE USING (user_id = auth.uid());

-- 5. RLS for jobs — replace the overly restrictive policy
-- Jobs should be manageable by the system (SECURITY DEFINER RPC) and readable by order owners
DROP POLICY IF EXISTS "Jobs are system-managed" ON public.jobs;
DROP POLICY IF EXISTS "Admins have full access to jobs" ON public.jobs;
DROP POLICY IF EXISTS "Order owners can read jobs" ON public.jobs;

CREATE POLICY "Order owners can read jobs" ON public.jobs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (payload->>'orderId')
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Jobs are system-managed" ON public.jobs
  FOR INSERT WITH CHECK (true);

-- 6. RLS for coupon_usages — allow INSERT via create_order SECURITY DEFINER
DROP POLICY IF EXISTS "Users can view own coupon usages" ON public.coupon_usages;
CREATE POLICY "Users can view own coupon usages" ON public.coupon_usages
  FOR SELECT USING (user_id = auth.uid());

-- 7. Admin policies for new tables
DROP POLICY IF EXISTS "Admins have full access to assets" ON public.assets;
CREATE POLICY "Admins have full access to assets" ON public.assets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

DROP POLICY IF EXISTS "Admins have full access to shipping" ON public.shipping_details;
CREATE POLICY "Admins have full access to shipping" ON public.shipping_details
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

DROP POLICY IF EXISTS "Admins have full access to notification events" ON public.notification_events;
CREATE POLICY "Admins have full access to notification events" ON public.notification_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );
