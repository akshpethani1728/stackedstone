import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError, ForbiddenError } from "@/lib/errors";

export const BookService = {
  async create(userId: string): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .insert({
        user_id: userId,
        status: "draft",
        extras: { gift_wrap: false, gift_message: "", storage_box: false, extra_copy: false },
        photo_count: 0,
      })
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async getById(id: string): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .select("*, destination:destination_id(*), edition:edition_id(*), cover_design:cover_design_id(*), material:material_id(*), paper_type:paper_type_id(*), page_count:page_count_id(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Book", id);
    return data;
  },

  async getByUser(userId: string): Promise<any[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getDraftsByUser(userId: string): Promise<any[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .select("*, destination:destination_id(name, slug, region)")
      .eq("user_id", userId)
      .in("status", ["draft", "uploading", "generating", "preview_ready"])
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async update(id: string, input: Record<string, unknown>): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Book", id);
    return data;
  },

  async softDelete(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("books")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw fromSupabaseError(error);
  },

  async archive(id: string): Promise<any> {
    return BookService.update(id, { status: "archived" });
  },

  async getDraftCount(userId: string): Promise<number> {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("status", ["draft", "uploading", "generating", "preview_ready"])
      .is("deleted_at", null);

    if (error) throw fromSupabaseError(error);
    return count ?? 0;
  },
};
