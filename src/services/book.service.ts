import { getSupabaseClient } from "@/lib/supabase";

import { logger } from "@/lib/logger";
import { DatabaseError, NotFoundError, fromSupabaseError } from "@/lib/errors";
import type { Book, BookPhoto } from "@/lib/validations/book";

export const BookService = {
  async getById(id: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .select("*, destination:destination_id(*), edition:edition_id(*), cover:cover_design_id(*), material:material_id(*), paper:paper_type_id(*), page_count:page_count_id(*)")
      .eq("id", id)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Book", id);
    return data;
  },

  async getByUser(userId: string) {
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

  async create(userId: string, input: Record<string, unknown>) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .insert({ user_id: userId, ...input })
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    logger.info("BookService", "Book created", { id: data.id, userId });
    return data;
  },

  async update(id: string, input: Record<string, unknown>) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Book", id);
    return data;
  },

  async softDelete(id: string) {
    return BookService.update(id, { deleted_at: new Date().toISOString() });
  },

  async getPhotos(bookId: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("book_photos")
      .select("*")
      .eq("book_id", bookId)
      .order("sort_order", { ascending: true });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },
};
