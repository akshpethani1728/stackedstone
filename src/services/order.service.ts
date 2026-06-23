import { getSupabaseClient } from "@/lib/supabase";
import { AuthService } from "@/services/auth.service";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";
import type { Order, OrderItem } from "@/types/checkout";

export const OrderService = {
  async create(payload: {
    bookId: string;
    addressId: string;
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    total: number;
    couponId?: string;
    couponCode?: string;
    paymentMethod: string;
    paymentId?: string;
    notes?: string;
  }): Promise<Order> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.rpc("create_order", {
      p_user_id: user.id,
      p_book_id: payload.bookId,
      p_address_id: payload.addressId,
      p_subtotal: payload.subtotal,
      p_shipping_cost: payload.shippingCost,
      p_discount_amount: payload.discountAmount,
      p_total: payload.total,
      p_coupon_id: payload.couponId ?? null,
      p_coupon_code: payload.couponCode ?? null,
      p_payment_method: payload.paymentMethod,
      p_payment_id: payload.paymentId ?? null,
      p_notes: payload.notes ?? null,
    });

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async list(): Promise<Order[]> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, address:address_id(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getById(id: string): Promise<Order & { items: OrderItem[] }> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, address:address_id(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (orderError) throw fromSupabaseError(orderError);
    if (!order) throw new NotFoundError("Order", id);

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    if (itemsError) throw fromSupabaseError(itemsError);

    return { ...order, items: items ?? [] };
  },

  async getByOrderNumber(orderNumber: string): Promise<Order & { items: OrderItem[] }> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, address:address_id(*)")
      .eq("order_number", orderNumber)
      .eq("user_id", user.id)
      .single();

    if (orderError) throw fromSupabaseError(orderError);
    if (!order) throw new NotFoundError("Order", orderNumber);

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (itemsError) throw fromSupabaseError(itemsError);

    return { ...order, items: items ?? [] };
  },
};
