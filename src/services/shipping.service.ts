import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";
import { config } from "@/config";
import type { ShippingDetail } from "@/types/production";

export const ShippingService = {
  async getByOrder(orderId: string): Promise<ShippingDetail | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("shipping_details")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw fromSupabaseError(error);
    }
    return data;
  },

  async create(orderId: string): Promise<ShippingDetail> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("shipping_details")
      .insert({
        order_id: orderId,
        weight_grams: config.shipping.defaultWeight,
        length_cm: config.shipping.dimensions.length,
        width_cm: config.shipping.dimensions.width,
        height_cm: config.shipping.dimensions.height,
      })
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async updateTracking(
    orderId: string,
    data: {
      courier: string;
      tracking_number: string;
      tracking_url?: string;
      label_url?: string;
    },
  ): Promise<ShippingDetail> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("shipping_details")
      .update({
        courier: data.courier,
        tracking_number: data.tracking_number,
        tracking_url: data.tracking_url ?? null,
        label_url: data.label_url ?? null,
        shipped_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    if (error) throw fromSupabaseError(error);

    const updated = await ShippingService.getByOrder(orderId);
    if (!updated) throw new NotFoundError("ShippingDetail", orderId);
    return updated;
  },

  async markDelivered(orderId: string): Promise<ShippingDetail> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("shipping_details")
      .update({ delivered_at: new Date().toISOString() })
      .eq("order_id", orderId);

    if (error) throw fromSupabaseError(error);

    const updated = await ShippingService.getByOrder(orderId);
    if (!updated) throw new NotFoundError("ShippingDetail", orderId);
    return updated;
  },
};
