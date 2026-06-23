import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { BookPreview } from "@/types/preview";

export const PreviewService = {
  async getPreview(bookId: string): Promise<BookPreview | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .select("preview_data, preview_generated_at")
      .eq("id", bookId)
      .not("preview_data", "is", null)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw fromSupabaseError(error);
    }

    return data?.preview_data as BookPreview ?? null;
  },

  async savePreview(bookId: string, preview: BookPreview): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("books")
      .update({
        preview_data: preview as any,
        preview_generated_at: new Date().toISOString(),
        status: "preview_ready",
      })
      .eq("id", bookId);

    if (error) throw fromSupabaseError(error);
    logger.info("PreviewService", "Preview saved", { bookId, pages: preview.totalPages });
  },

  async clearPreview(bookId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("books")
      .update({
        preview_data: null,
        preview_generated_at: null,
        status: "draft",
      })
      .eq("id", bookId);

    if (error) throw fromSupabaseError(error);
  },

  async needsRegeneration(bookId: string, photoCount: number, pageCount: number): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .select("preview_data, preview_generated_at, photo_count, page_count_id")
      .eq("id", bookId)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data?.preview_data) return true;

    const prev = data.preview_data as any;
    return prev.photoCount !== photoCount || prev.totalPages !== pageCount;
  },

  async setGeneratingStatus(bookId: string): Promise<void> {
    const supabase = getSupabaseClient();
    await supabase.from("books").update({ status: "generating" }).eq("id", bookId);
  },
};
