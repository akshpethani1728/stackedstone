import type { OrderStatus } from "./enums";
import type { AuditTimestamps } from "./common";

export interface Order extends AuditTimestamps {
  id: string;
  user_id: string;
  address_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  notes: string | null;
  paid_at: string | null;
}

export interface OrderItem extends AuditTimestamps {
  id: string;
  order_id: string;
  book_id: string | null;
  item_type: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
