import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError, StorageError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { getStoragePath, getPublicUrl, getImageDimensions } from "@/lib/upload-utils";

export const UploadService = {
  async uploadFile(
    bookId: string,
    userId: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<{ storageUrl: string; record: any; width: number; height: number }> {
    const supabase = getSupabaseClient();
    const path = getStoragePath(userId, bookId, file.name);
    onProgress?.(10);

    onProgress?.(20);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("book-images")
      .upload(path, file, { upsert: false });

    if (uploadError) throw new StorageError(`Upload failed: ${uploadError.message}`, uploadError);
    onProgress?.(70);

    const storageUrl = getPublicUrl(path);

    const { width, height } = await getImageDimensions(file);
    onProgress?.(80);

    const { data: existing, error: existingError } = await supabase
      .from("book_photos")
      .select("sort_order")
      .eq("book_id", bookId)
      .order("sort_order", { ascending: false })
      .limit(1);

    if (existingError) throw fromSupabaseError(existingError);
    const nextSort = (existing?.[0]?.sort_order ?? -1) + 1;

    const { data, error: insertError } = await supabase
      .from("book_photos")
      .insert({
        book_id: bookId,
        storage_url: storageUrl,
        sort_order: nextSort,
        width,
        height,
        file_size_bytes: file.size,
      })
      .select()
      .single();

    if (insertError) {
      try {
        await supabase.storage.from("book-images").remove([path]);
      } catch {}
      throw fromSupabaseError(insertError);
    }
    onProgress?.(95);

    await UploadService.updatePhotoCount(bookId);
    onProgress?.(100);

    logger.info("UploadService", `Uploaded ${file.name} (${width}x${height})`, { bookId, path });
    return { storageUrl, record: data, width, height };
  },

  async removePhoto(photoId: string, storageUrl: string): Promise<void> {
    const supabase = getSupabaseClient();
    const path = extractStoragePath(storageUrl);
    if (path) {
      const { error: storageError } = await supabase.storage.from("book-images").remove([path]);
      if (storageError) logger.error("UploadService", "Failed to remove from storage", storageError);
    }
    const { error } = await supabase.from("book_photos").delete().eq("id", photoId);
    if (error) throw fromSupabaseError(error);
    logger.info("UploadService", "Removed photo", { photoId });
  },

  async replacePhoto(
    bookId: string,
    userId: string,
    photoId: string,
    oldStorageUrl: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<{ storageUrl: string; record: any; width: number; height: number }> {
    await UploadService.removePhoto(photoId, oldStorageUrl);
    const result = await UploadService.uploadFile(bookId, userId, file, onProgress);
    return result;
  },

  async listPhotos(bookId: string): Promise<any[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("book_photos")
      .select("*")
      .eq("book_id", bookId)
      .order("sort_order", { ascending: true });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async reorderPhotos(photoIds: string[]): Promise<void> {
    const supabase = getSupabaseClient();
    const updates = photoIds.map((id, index) => ({
      id,
      sort_order: index,
    }));
    const { error } = await supabase.from("book_photos").upsert(updates);
    if (error) throw fromSupabaseError(error);
    logger.info("UploadService", "Reordered photos", { count: photoIds.length });
  },

  async updatePhotoCount(bookId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { count, error: countError } = await supabase
      .from("book_photos")
      .select("*", { count: "exact", head: true })
      .eq("book_id", bookId);
    if (countError) throw fromSupabaseError(countError);
    const { error } = await supabase.from("books").update({ photo_count: count ?? 0 }).eq("id", bookId);
    if (error) throw fromSupabaseError(error);
  },
};

function extractStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const match = url.pathname.match(/\/object\/public\/book-images\/(.+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
