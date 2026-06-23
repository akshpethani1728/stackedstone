import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";

export const OrderService = {
  async getById(id: string): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("id", id)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Order", id);
    return data;
  },

  async getByUser(userId: string): Promise<any[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getByOrderNumber(orderNumber: string): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("order_number", orderNumber)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Order", orderNumber);
    return data;
  },

  async create(input: Record<string, unknown>): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .insert(input)
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async updateStatus(id: string, status: string): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Order", id);
    return data;
  },
};
