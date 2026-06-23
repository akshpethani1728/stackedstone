import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError } from "@/lib/errors";

export const NotificationService = {
  async create(input: Record<string, unknown>): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("notifications")
      .insert(input)
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async getByUser(userId: string): Promise<any[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async markAsRead(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw fromSupabaseError(error);
  },

  async markAllAsRead(userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null);

    if (error) throw fromSupabaseError(error);
  },
};
