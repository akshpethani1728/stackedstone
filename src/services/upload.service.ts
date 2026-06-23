import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export const UploadService = {
  async addPhoto(bookId: string, storageUrl: string, sortOrder: number): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("book_photos")
      .insert({ book_id: bookId, storage_url: storageUrl, sort_order: sortOrder })
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async removePhoto(photoId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("book_photos")
      .delete()
      .eq("id", photoId);

    if (error) throw fromSupabaseError(error);
  },

  async reorderPhotos(bookId: string, photoIds: string[]): Promise<void> {
    const supabase = getSupabaseClient();
    const updates = photoIds.map((id, index) => ({
      id,
      book_id: bookId,
      sort_order: index,
    }));

    const { error } = await supabase.from("book_photos").upsert(updates as any);
    if (error) throw fromSupabaseError(error);
  },

  async updatePhotoCount(bookId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { count, error: countError } = await supabase
      .from("book_photos")
      .select("*", { count: "exact", head: true })
      .eq("book_id", bookId);

    if (countError) throw fromSupabaseError(countError);

    const { error } = await supabase
      .from("books")
      .update({ photo_count: count ?? 0 })
      .eq("id", bookId);

    if (error) throw fromSupabaseError(error);
  },
};
