-- ===================== MIGRATION 00005: CHECKOUT INFRASTRUCTURE =====================

-- 1. Add recipient fields to addresses
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Add coupon / discount fields to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- 3. Coupon usage tracking
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon ON public.coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user ON public.coupon_usages(user_id);

-- 4. Enable RLS on coupon_usages
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own coupon usages" ON public.coupon_usages;
CREATE POLICY "Users can view own coupon usages" ON public.coupon_usages
  FOR SELECT USING (user_id = auth.uid());

-- 5. RLS for orders — users can view their own
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 6. RLS for order_items — inherit through order
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- 7. RLS for addresses — users manage their own
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can soft-delete own addresses" ON public.addresses;
CREATE POLICY "Users can soft-delete own addresses" ON public.addresses
  FOR UPDATE USING (user_id = auth.uid() AND deleted_at IS NULL);

-- 8. RLS for coupons — anyone can read active coupons
DROP POLICY IF EXISTS "Anyone can read active coupons" ON public.coupons;
CREATE POLICY "Anyone can read active coupons" ON public.coupons
  FOR SELECT USING (is_active = true AND deleted_at IS NULL);

-- 9. Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'SS-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
$$;

-- 10. Function to create order atomically
CREATE OR REPLACE FUNCTION public.create_order(
  p_user_id UUID,
  p_book_id UUID,
  p_address_id UUID,
  p_subtotal INTEGER,
  p_shipping_cost INTEGER,
  p_discount_amount INTEGER,
  p_total INTEGER,
  p_coupon_id UUID DEFAULT NULL,
  p_coupon_code TEXT DEFAULT NULL,
  p_payment_method TEXT DEFAULT 'mock',
  p_payment_id TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order public.orders;
  v_order_number TEXT;
BEGIN
  -- Generate a unique order number
  v_order_number := public.generate_order_number();

  -- Insert the order
  INSERT INTO public.orders (
    user_id, address_id, order_number, status, subtotal, shipping_cost,
    discount_amount, total, coupon_id, coupon_code, payment_method,
    payment_id, notes, paid_at
  ) VALUES (
    p_user_id, p_address_id, v_order_number, 'confirmed',
    p_subtotal, p_shipping_cost, p_discount_amount, p_total,
    p_coupon_id, p_coupon_code, p_payment_method, p_payment_id,
    p_notes, now()
  )
  RETURNING * INTO v_order;

  -- Insert order item for the book
  INSERT INTO public.order_items (order_id, book_id, item_type, name, quantity, unit_price, total_price)
  SELECT
    v_order.id, p_book_id, 'book', b.title, 1,
    p_subtotal, p_subtotal
  FROM public.books b WHERE b.id = p_book_id;

  -- Update book status to ordered
  UPDATE public.books SET status = 'ordered', updated_at = now() WHERE id = p_book_id;

  -- Increment coupon usage if applied
  IF p_coupon_id IS NOT NULL THEN
    UPDATE public.coupons SET used_count = used_count + 1, updated_at = now() WHERE id = p_coupon_id;
    INSERT INTO public.coupon_usages (coupon_id, user_id, order_id, discount_amount)
    VALUES (p_coupon_id, p_user_id, v_order.id, p_discount_amount);
  END IF;

  RETURN v_order;
END;
$$;
