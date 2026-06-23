import { getSupabaseClient, getSupabaseServiceClient } from "@/lib/supabase";

import { StorageError } from "@/lib/errors";

export const StorageService = {
  async upload(bucket: string, path: string, file: File) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw new StorageError(`Upload failed: ${error.message}`, error);
    return data;
  },

  async uploadWithServiceRole(bucket: string, path: string, file: Blob, contentType: string) {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw new StorageError(`Admin upload failed: ${error.message}`, error);
    return data;
  },

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const supabase = getSupabaseClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  async delete(bucket: string, paths: string[]) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage.from(bucket).remove(paths);

    if (error) throw new StorageError(`Delete failed: ${error.message}`, error);
    return data;
  },

  async list(bucket: string, folder: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      sortBy: { column: "name", order: "asc" },
    });

    if (error) throw new StorageError(`List failed: ${error.message}`, error);
    return data ?? [];
  },
};
