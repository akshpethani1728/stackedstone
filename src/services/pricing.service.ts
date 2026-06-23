import { getSupabaseClient } from "@/lib/supabase";
import { config } from "@/config";
import type { PriceBreakdown } from "@/types/checkout";
import type { StudioState } from "@/types";

export const PricingService = {
  async breakdown(state: StudioState): Promise<PriceBreakdown> {
    const [editionPrice, materialDelta, paperDelta, pageDelta] = await Promise.all([
      PricingService._fetchEditionPrice(state.edition?.id),
      PricingService._fetchDelta("book_materials", state.material?.id),
      PricingService._fetchDelta("paper_types", state.paper?.id),
      PricingService._fetchDelta("page_counts", state.pageCount?.id),
    ]);

    const edition = editionPrice;
    const material = materialDelta;
    const paper = paperDelta;
    const pageCount = pageDelta;
    const extras = PricingService._extrasTotal(state.extras);

    const subtotal = edition + material + paper + pageCount + extras;
    const shipping = config.shipping.acrossIndia;

    return {
      edition,
      material,
      paper,
      pageCount,
      extras,
      subtotal,
      shipping,
      discount: 0,
      total: subtotal + shipping,
    };
  },

  async _fetchEditionPrice(id: string | undefined): Promise<number> {
    if (!id) return 0;
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from("book_editions")
      .select("base_price")
      .eq("id", id)
      .single();
    return data?.base_price ?? 4990;
  },

  async _fetchDelta(table: string, id: string | undefined): Promise<number> {
    if (!id) return 0;
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from(table)
      .select("price_delta")
      .eq("id", id)
      .single();
    return data?.price_delta ?? 0;
  },

  _extrasTotal(extras: StudioState["extras"]): number {
    const e = config.extras;
    let total = 0;
    if (extras.giftWrap) total += e.giftWrap;
    if (extras.storageBox) total += e.storageBox;
    if (extras.extraCopy) total += e.extraCopy;
    return total;
  },
};
