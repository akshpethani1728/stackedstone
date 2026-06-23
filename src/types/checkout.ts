export type Address = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type AddressInput = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
};

export type Order = {
  id: string;
  user_id: string;
  address_id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  currency: string;
  coupon_id: string | null;
  coupon_code: string | null;
  payment_method: string | null;
  payment_id: string | null;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  address?: Address;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  book_id: string | null;
  item_type: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  max_uses_per_user: number | null;
  is_active: boolean;
  expires_at: string | null;
};

export type CouponValidation = {
  valid: boolean;
  coupon?: Coupon;
  discount?: number;
  message?: string;
};

export type PriceBreakdown = {
  edition: number;
  material: number;
  paper: number;
  pageCount: number;
  extras: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
};

export type CheckoutPayload = {
  addressId: string;
  couponCode?: string;
  couponId?: string;
  discountAmount?: number;
  notes?: string;
};
