import type { Extras, StudioState } from "@/types";
import { extraOptions } from "@/data";

const SHIPPING = 499;

export function extrasTotal(extras: Extras): number {
  return extraOptions.reduce(
    (acc, e) => acc + (extras[e.slug as keyof Extras] ? e.price : 0),
    0,
  );
}

export function subtotal(state: StudioState): number {
  return (
    (state.edition?.price ?? 7990) +
    (state.material?.priceDelta ?? 0) +
    (state.paper?.priceDelta ?? 0) +
    (state.pageCount?.priceDelta ?? 0) +
    extrasTotal(state.extras)
  );
}

export function total(state: StudioState): number {
  return subtotal(state) + SHIPPING;
}

export { SHIPPING as SHIPPING_COST };
