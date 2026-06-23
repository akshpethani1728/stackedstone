-- Stacked Stone — Row Level Security
-- Migration 00003: Enable RLS and create policies

-- ===================== ENABLE RLS =====================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_cover_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- ===================== CATALOGUE (PUBLIC READ) =====================

CREATE POLICY "Catalogue is public read"
  ON public.destinations FOR SELECT
  USING (published = true);

CREATE POLICY "Catalogue is public read"
  ON public.book_editions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Catalogue is public read"
  ON public.cover_designs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Catalogue is public read"
  ON public.destination_cover_designs FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Catalogue is public read"
  ON public.book_materials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Catalogue is public read"
  ON public.paper_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Catalogue is public read"
  ON public.page_counts FOR SELECT
  USING (is_active = true);

-- ===================== USERS =====================

CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

-- ===================== ADDRESSES =====================

CREATE POLICY "Users can manage own addresses"
  ON public.addresses FOR ALL
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

-- ===================== BOOKS =====================

CREATE POLICY "Users can manage own books"
  ON public.books FOR ALL
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

-- ===================== BOOK PHOTOS =====================

CREATE POLICY "Users can manage own book photos"
  ON public.book_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.books
      WHERE books.id = book_photos.book_id
        AND books.user_id = auth.uid()
        AND books.deleted_at IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.books
      WHERE books.id = book_photos.book_id
        AND books.user_id = auth.uid()
        AND books.deleted_at IS NULL
    )
  );

-- ===================== ORDERS =====================

CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- ===================== NOTIFICATIONS =====================

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ===================== ADMIN POLICIES =====================

CREATE POLICY "Admins have full access to catalogue"
  ON public.destinations FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to editions"
  ON public.book_editions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to cover designs"
  ON public.cover_designs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to materials"
  ON public.book_materials FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to paper types"
  ON public.paper_types FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to page counts"
  ON public.page_counts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to users"
  ON public.users FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to books"
  ON public.books FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to orders"
  ON public.orders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to order items"
  ON public.order_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to notifications"
  ON public.notifications FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to coupons"
  ON public.coupons FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

CREATE POLICY "Admins have full access to jobs"
  ON public.jobs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

-- Jobs are system-managed, not user-accessible
CREATE POLICY "Jobs are system-managed"
  ON public.jobs FOR ALL
  USING (false);

-- Coupons are admin-managed
CREATE POLICY "Coupons are admin-managed"
  ON public.coupons FOR SELECT
  USING (false);

-- ===================== STORAGE RLS =====================

-- book-images: users can CRUD their own images
CREATE POLICY "Users can manage own book images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'book-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'book-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- book-previews: public read
CREATE POLICY "Public read book previews"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'book-previews');

CREATE POLICY "Admins manage book previews"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'book-previews'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

-- covers: public read, admin write
CREATE POLICY "Public read covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Admins manage covers"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'covers'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

-- destination-assets: public read, admin write
CREATE POLICY "Public read destination assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'destination-assets');

CREATE POLICY "Admins manage destination assets"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'destination-assets'
    AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND deleted_at IS NULL)
  );

-- thumbnails: public read
CREATE POLICY "Public read thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

-- avatars: public read, user manages own
CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users manage own avatar"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
