import { getSupabaseClient } from "@/lib/supabase";
import { AuthService } from "@/services/auth.service";
import type { Coupon, CouponValidation } from "@/types/checkout";

export const CouponService = {
  async validate(code: string, subtotal: number): Promise<CouponValidation> {
    const supabase = getSupabaseClient();
    const normalized = code.trim().toUpperCase();

    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", normalized)
      .eq("is_active", true)
      .is("deleted_at", null)
      .single();

    if (!coupon) {
      return { valid: false, message: "Coupon not found" };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { valid: false, message: "Coupon has expired" };
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return { valid: false, message: "Coupon usage limit reached" };
    }

    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return {
        valid: false,
        message: `Minimum order amount of ₹${coupon.min_order_amount} required`,
      };
    }

    if (coupon.max_uses_per_user) {
      const user = await AuthService.requireAuth();
      const { count } = await supabase
        .from("coupon_usages")
        .select("*", { count: "exact", head: true })
        .eq("coupon_id", coupon.id)
        .eq("user_id", user.id);

      if (count && count >= coupon.max_uses_per_user) {
        return { valid: false, message: "You have already used this coupon" };
      }
    }

    const discount = CouponService._calculateDiscount(coupon, subtotal);

    return { valid: true, coupon, discount, message: `Coupon applied! You save ₹${discount}` };
  },

  _calculateDiscount(coupon: Coupon, subtotal: number): number {
    if (coupon.discount_type === "percentage") {
      return Math.round(subtotal * coupon.discount_value / 100);
    }
    return Math.min(coupon.discount_value, subtotal);
  },
};
