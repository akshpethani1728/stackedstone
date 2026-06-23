import { getSupabaseClient } from "@/lib/supabase";

import { fromSupabaseError, NotFoundError } from "@/lib/errors";

export const DestinationService = {
  async getAll() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getBySlug(slug: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Destination", slug);
    return data;
  },

  async getCovers(destinationId: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("destination_cover_designs")
      .select("cover_design:cover_design_id(*)")
      .eq("destination_id", destinationId)
      .order("sort_order", { ascending: true });

    if (error) throw fromSupabaseError(error);
    return data?.map((d) => d.cover_design) ?? [];
  },

  async getByCategory(category: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("category", category)
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },
};
