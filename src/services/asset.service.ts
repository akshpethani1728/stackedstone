import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";
import type { Asset, AssetType } from "@/types/production";

export const AssetService = {
  async record(input: {
    book_id: string;
    order_id?: string;
    asset_type: AssetType;
    file_path: string;
    file_size?: number;
    mime_type?: string;
    width?: number;
    height?: number;
    dpi?: number;
    metadata?: Record<string, unknown>;
  }): Promise<Asset> {
    const supabase = getSupabaseClient();

    const existing = await supabase
      .from("assets")
      .select("version")
      .eq("book_id", input.book_id)
      .eq("asset_type", input.asset_type)
      .order("version", { ascending: false })
      .limit(1);

    const version = (existing.data?.[0]?.version ?? 0) + 1;

    const { data, error } = await supabase
      .from("assets")
      .insert({
        book_id: input.book_id,
        order_id: input.order_id ?? null,
        asset_type: input.asset_type,
        file_path: input.file_path,
        file_size: input.file_size ?? null,
        mime_type: input.mime_type ?? null,
        width: input.width ?? null,
        height: input.height ?? null,
        dpi: input.dpi ?? 300,
        version,
        metadata: (input.metadata ?? {}) as any,
      })
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async getByBook(bookId: string): Promise<Asset[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getByOrder(orderId: string): Promise<Asset[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getLatest(bookId: string, assetType: AssetType): Promise<Asset | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("book_id", bookId)
      .eq("asset_type", assetType)
      .order("version", { ascending: false })
      .limit(1);

    if (error) throw fromSupabaseError(error);
    return data?.[0] ?? null;
  },

  async getById(id: string): Promise<Asset> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Asset", id);
    return data;
  },
};
