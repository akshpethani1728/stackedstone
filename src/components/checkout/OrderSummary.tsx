import { BookMockup } from "@/components/studio/BookMockup";
import { coversFor } from "@/data";
import type { PriceBreakdown } from "@/types/checkout";
import type { StudioState } from "@/types";

type Props = {
  state: StudioState;
  breakdown: PriceBreakdown;
  couponMessage?: string;
};

export function OrderSummary({ state, breakdown, couponMessage }: Props) {
  const cover = state.cover ?? coversFor(state.destination?.slug)[0];

  return (
    <aside className="space-y-10">
      {cover && (
        <BookMockup
          cover={cover}
          destination={state.destination}
          edition={state.edition}
          title={state.title || state.destination?.name}
          photo={state.photos?.[0]}
          size="sm"
        />
      )}

      <div className="border border-border p-8 bg-beige/30">
        <p className="eyebrow">Your order</p>
        <h2 className="font-serif text-2xl italic mt-3">
          {state.title || state.destination?.name || "Untitled Volume"}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{state.destination?.region ?? "—"}</p>

        <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
          <Line k="Edition" v={state.edition?.name} />
          <Line k="Destination" v={state.destination?.name} />
          <Line k="Cover" v={cover?.name} />
          <Line k="Material" v={state.material?.name} />
          <Line k="Paper" v={state.paper ? `${state.paper.name}` : "—"} />
          <Line k="Pages" v={state.pageCount ? `${state.pageCount.pages} pages` : "—"} />
          <Line k="Photographs" v={`${state.photoCount || 0}`} />
          <Line k="Estimated" v="10–14 days · Made in India" />
        </div>

        <div className="mt-8 border-t border-border pt-6 space-y-3 text-sm">
          <Money k="Edition" v={breakdown.edition} />
          {breakdown.material > 0 && <Money k="Material" v={breakdown.material} />}
          {breakdown.paper > 0 && <Money k="Paper" v={breakdown.paper} />}
          {breakdown.pageCount > 0 && <Money k="Pages" v={breakdown.pageCount} />}
          {breakdown.extras > 0 && <Money k="Extras" v={breakdown.extras} />}
          <Money k="Subtotal" v={breakdown.subtotal} />
          <Money k="Shipping across India" v={breakdown.shipping} />
          {breakdown.discount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount</span><span>-₹{breakdown.discount}</span>
            </div>
          )}
          <div className="flex justify-between font-serif text-2xl pt-4 border-t border-border">
            <span>Total</span><span>₹{breakdown.total}</span>
          </div>
          {couponMessage && (
            <p className="text-xs text-green-700 italic mt-2">{couponMessage}</p>
          )}
        </div>

        <p className="mt-6 text-xs text-muted-foreground italic leading-relaxed">
          Each book is made to order. We do not hold inventory — your volume exists because you
          commissioned it.
        </p>
      </div>
    </aside>
  );
}

function Line({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="eyebrow shrink-0">{k}</span>
      <span className="font-serif text-base text-right text-foreground/90">{v ?? "—"}</span>
    </div>
  );
}

function Money({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex justify-between">
      <span>{k}</span><span>₹{v}</span>
    </div>
  );
}
