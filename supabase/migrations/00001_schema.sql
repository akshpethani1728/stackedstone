-- Stacked Stone — Complete Database Schema
-- Migration 00001: Core schema

-- ===================== ENUMS =====================

CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
CREATE TYPE address_type AS ENUM ('shipping', 'billing');
CREATE TYPE book_status AS ENUM (
  'draft', 'uploading', 'generating', 'preview_ready',
  'ordered', 'printing', 'quality_check', 'packed',
  'shipped', 'delivered', 'archived'
);
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing',
  'shipped', 'delivered', 'cancelled', 'refunded'
);
CREATE TYPE job_type AS ENUM (
  'upload_images', 'generate_preview', 'generate_pdf',
  'send_email', 'generate_thumbnail', 'sync_order'
);
CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE notification_channel AS ENUM ('email', 'in_app');
CREATE TYPE notification_type AS ENUM (
  'order_confirmation', 'shipping_update', 'delivery_confirmation',
  'promotional', 'job_failed'
);
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount');
CREATE TYPE destination_category AS ENUM ('Coastline', 'Mountains', 'Cities', 'Deserts', 'Backwaters', 'Atlantic');

-- ===================== USERS =====================

-- Users extends Supabase auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  phone TEXT,
  email_verified_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON public.users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON public.users(role) WHERE deleted_at IS NULL;

-- ===================== ADMIN USERS =====================

CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'admin',
  permissions JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT admin_users_role_check CHECK (role IN ('admin', 'super_admin'))
);

CREATE UNIQUE INDEX idx_admin_users_user_id ON public.admin_users(user_id) WHERE deleted_at IS NULL;

-- ===================== ADDRESSES =====================

CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type address_type NOT NULL DEFAULT 'shipping',
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_addresses_user_id ON public.addresses(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_addresses_default ON public.addresses(user_id, is_default) WHERE is_default = true AND deleted_at IS NULL;

-- ===================== DESTINATIONS =====================

CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  region TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  tagline TEXT,
  mood TEXT,
  palette_bg TEXT,
  palette_ink TEXT,
  palette_accent TEXT,
  hero_url TEXT,
  cover_url TEXT,
  season TEXT,
  category destination_category NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  stories JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  pairings JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_destinations_published ON public.destinations(published, sort_order);
CREATE INDEX idx_destinations_slug ON public.destinations(slug);

-- ===================== BOOK EDITIONS =====================

CREATE TABLE public.book_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  pages_min INTEGER NOT NULL,
  pages_max INTEGER NOT NULL,
  size_label TEXT NOT NULL,
  base_price INTEGER NOT NULL,
  ideal_for TEXT,
  photo_estimate_min INTEGER,
  photo_estimate_max INTEGER,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_book_editions_active ON public.book_editions(is_active, sort_order);

-- ===================== COVER DESIGNS =====================

CREATE TABLE public.cover_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  mood TEXT,
  ink_color TEXT,
  panel_color TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cover_designs_active ON public.cover_designs(is_active, sort_order);

-- Junction table: Destination <-> CoverDesign
CREATE TABLE public.destination_cover_designs (
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  cover_design_id UUID NOT NULL REFERENCES public.cover_designs(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (destination_id, cover_design_id)
);

CREATE INDEX idx_dest_cover_dest ON public.destination_cover_designs(destination_id);

-- ===================== BOOK MATERIALS =====================

CREATE TABLE public.book_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  feel TEXT,
  description TEXT,
  price_delta INTEGER NOT NULL DEFAULT 0,
  swatch_color TEXT,
  texture_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_book_materials_active ON public.book_materials(is_active, sort_order);

-- ===================== PAPER TYPES =====================

CREATE TABLE public.paper_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  weight TEXT,
  finish TEXT,
  best_for TEXT,
  price_delta INTEGER NOT NULL DEFAULT 0,
  texture_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_paper_types_active ON public.paper_types(is_active, sort_order);

-- ===================== PAGE COUNTS =====================

CREATE TABLE public.page_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pages INTEGER NOT NULL,
  label TEXT NOT NULL,
  recommended_min INTEGER,
  recommended_max INTEGER,
  ideal_for TEXT,
  price_delta INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_counts_active ON public.page_counts(is_active, sort_order);

-- ===================== BOOKS =====================

CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  edition_id UUID REFERENCES public.book_editions(id) ON DELETE SET NULL,
  cover_design_id UUID REFERENCES public.cover_designs(id) ON DELETE SET NULL,
  material_id UUID REFERENCES public.book_materials(id) ON DELETE SET NULL,
  paper_type_id UUID REFERENCES public.paper_types(id) ON DELETE SET NULL,
  page_count_id UUID REFERENCES public.page_counts(id) ON DELETE SET NULL,
  title TEXT,
  status book_status NOT NULL DEFAULT 'draft',
  extras JSONB NOT NULL DEFAULT '{"gift_wrap":false,"gift_message":"","storage_box":false,"extra_copy":false}'::jsonb,
  price_breakdown JSONB,
  total_price INTEGER,
  photo_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_books_user_id ON public.books(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_books_status ON public.books(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_books_user_status ON public.books(user_id, status) WHERE deleted_at IS NULL;

-- ===================== BOOK PHOTOS =====================

CREATE TABLE public.book_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  storage_url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  file_size_bytes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_book_photos_book_id ON public.book_photos(book_id, sort_order);

-- ===================== ORDERS =====================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  address_id UUID NOT NULL REFERENCES public.addresses(id) ON DELETE RESTRICT,
  order_number TEXT NOT NULL UNIQUE,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL DEFAULT 499,
  total INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

-- ===================== ORDER ITEMS =====================

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  item_type TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- ===================== JOBS =====================

CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type job_type NOT NULL,
  status job_status NOT NULL DEFAULT 'pending',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB,
  error_message TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  scheduled_for TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_status ON public.jobs(status, scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_jobs_type ON public.jobs(type, status);

-- ===================== NOTIFICATIONS =====================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  channel notification_channel NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE read_at IS NULL;

-- ===================== COUPONS =====================

CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type discount_type NOT NULL,
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  max_uses_per_user INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_coupons_code ON public.coupons(code) WHERE is_active = true AND deleted_at IS NULL;

-- ===================== TRIGGERS =====================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_book_editions_updated_at BEFORE UPDATE ON public.book_editions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cover_designs_updated_at BEFORE UPDATE ON public.cover_designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_book_materials_updated_at BEFORE UPDATE ON public.book_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_paper_types_updated_at BEFORE UPDATE ON public.paper_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_page_counts_updated_at BEFORE UPDATE ON public.page_counts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sync user on auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, last_sign_in_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.last_sign_in_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    last_sign_in_at = EXCLUDED.last_sign_in_at,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
