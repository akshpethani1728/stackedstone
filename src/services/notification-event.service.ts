import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError } from "@/lib/errors";
import type { NotificationEvent } from "@/types/production";

export const NotificationEventService = {
  async createEvent(input: {
    userId?: string;
    orderId?: string;
    eventType: string;
    subject?: string;
    body?: string;
    channel?: "email" | "in_app";
    data?: Record<string, unknown>;
  }): Promise<NotificationEvent> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("notification_events")
      .insert({
        user_id: input.userId ?? null,
        order_id: input.orderId ?? null,
        event_type: input.eventType,
        channel: input.channel ?? "in_app",
        subject: input.subject ?? null,
        body: input.body ?? null,
        data: (input.data ?? {}) as any,
      })
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async getByUser(userId: string): Promise<NotificationEvent[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("notification_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getByOrder(orderId: string): Promise<NotificationEvent[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("notification_events")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getUnread(userId: string): Promise<NotificationEvent[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("notification_events")
      .select("*")
      .eq("user_id", userId)
      .is("read_at", null)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async markAsRead(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("notification_events")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw fromSupabaseError(error);
  },

  async markAllAsRead(userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("notification_events")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null);

    if (error) throw fromSupabaseError(error);
  },
};
