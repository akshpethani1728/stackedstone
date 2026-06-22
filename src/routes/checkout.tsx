import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { BookMockup } from "@/components/studio/BookMockup";
import { coversFor, extraOptions, useStudio, type Extras } from "@/lib/studio-store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Stacked Stone" },
      { name: "description", content: "Quietly complete your order." },
    ],
  }),
  component: CheckoutPage,
});

function Field({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-3">{label}</span>
      <input
        {...rest}
        className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none py-3 font-serif text-xl placeholder:text-muted-foreground/60"
      />
    </label>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useStudio();
  const [submitting, setSubmitting] = useState(false);

  const cover = state.cover ?? coversFor(state.destination?.slug)[0];
  const ship = 18;
  const extrasTotal = extraOptions.reduce(
    (acc, e) => acc + (state.extras[e.slug as keyof Extras] ? e.price : 0),
    0,
  );
  const subtotal =
    (state.edition?.price ?? 149) +
    (state.material?.priceDelta ?? 0) +
    (state.paper?.priceDelta ?? 0) +
    (state.pageCount?.priceDelta ?? 0) +
    extrasTotal;
  const total = subtotal + ship;

  return (
    <StudioShell current="/checkout">
      <section className="container-edit pt-24 md:pt-32 pb-32">
        <div className="grid md:grid-cols-12 gap-16">
          <form
            className="md:col-span-7 space-y-14"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitting(true);
              setTimeout(() => navigate({ to: "/success" }), 900);
            }}
          >
            <header>
              <p className="eyebrow">Quietly · The Last Step</p>
              <h1 className="display mt-6 text-5xl md:text-6xl">A few last details.</h1>
            </header>

            <fieldset className="space-y-8">
              <legend className="eyebrow mb-4">Where the book finds you</legend>
              <div className="grid md:grid-cols-2 gap-8">
                <Field label="First name" required placeholder="Aanya" />
                <Field label="Last name" required placeholder="Raman" />
              </div>
              <Field label="Email" type="email" required placeholder="aanya@studio.com" />
              <Field label="Address" required placeholder="14 Carter Road, Bandra West" />
              <div className="grid md:grid-cols-3 gap-8">
                <Field label="City" required placeholder="Mumbai" />
                <Field label="Postal code" required placeholder="400050" />
                <Field label="Country" required placeholder="India" defaultValue="India" />
              </div>
            </fieldset>

            <fieldset className="space-y-8">
              <legend className="eyebrow mb-4">Payment</legend>
              <Field label="Card number" required placeholder="4242  4242  4242  4242" />
              <div className="grid grid-cols-2 gap-8">
                <Field label="Expiry" required placeholder="08 / 28" />
                <Field label="CVC" required placeholder="123" />
              </div>
            </fieldset>

            <div className="pt-6 flex flex-wrap items-center gap-8">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? "Sealing your order…" : `Place the order · $${total}`}
              </button>
              <p className="text-muted-foreground text-sm max-w-xs">
                Your book begins printing within 48 hours. You'll receive it in 14–18 days.
              </p>
            </div>
          </form>

          <aside className="md:col-span-4 md:col-start-9 md:sticky md:top-32 self-start space-y-10">
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
                <Line k="Edition"     v={state.edition?.name} />
                <Line k="Destination" v={state.destination?.name} />
                <Line k="Cover"       v={cover?.name} />
                <Line k="Material"    v={state.material?.name} />
                <Line k="Paper"       v={state.paper ? `${state.paper.name} · ${state.paper.weight}` : "—"} />
                <Line k="Pages"       v={state.pageCount ? `${state.pageCount.pages} pages` : "—"} />
                <Line k="Photographs" v={`${state.photoCount || 0}`} />
                {extraOptions.filter((e) => state.extras[e.slug as keyof Extras]).map((e) => (
                  <Line key={e.slug} k="Extra" v={e.name} />
                ))}
                <Line k="Estimated" v="14–18 days · Printed in India" />
              </div>

              <div className="mt-8 border-t border-border pt-6 space-y-3 text-sm">
                <Money k="Subtotal" v={subtotal} />
                <Money k="Worldwide shipping" v={ship} />
                <div className="flex justify-between font-serif text-2xl pt-4 border-t border-border">
                  <span>Total</span><span>${total}</span>
                </div>
              </div>

              <p className="mt-6 text-xs text-muted-foreground italic leading-relaxed">
                Each book is made to order. We do not hold inventory — your volume exists because you
                commissioned it.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </StudioShell>
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
      <span>{k}</span><span>${v}</span>
    </div>
  );
}
