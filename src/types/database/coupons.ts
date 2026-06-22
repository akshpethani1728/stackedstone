import type { DiscountType } from "./enums";
import type { AuditTimestamps, SoftDeletable } from "./common";

export interface Coupon extends AuditTimestamps, SoftDeletable {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  max_uses_per_user: number | null;
  is_active: boolean;
  expires_at: string | null;
}
