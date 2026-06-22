import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { useStudio } from "@/lib/studio-store";

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
  const price = state.edition?.price ?? 149;
  const ship = 18;
  const total = price + ship;

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
              <p className="eyebrow">Step Five · Quietly</p>
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
                {submitting ? "Sealing your order…" : "Place the order"}
              </button>
              <p className="text-muted-foreground text-sm max-w-xs">
                Your book begins printing within 48 hours. You'll receive it in 14–18 days.
              </p>
            </div>
          </form>

          <aside className="md:col-span-4 md:col-start-9 md:sticky md:top-32 self-start">
            <div className="border border-border p-10 bg-beige/30">
              <p className="eyebrow">Your order</p>
              <h2 className="font-serif text-3xl italic mt-4">{state.title || state.destination?.name || "Untitled Volume"}</h2>
              <p className="text-muted-foreground mt-1">{state.destination?.region ?? "—"}</p>

              <div className="mt-10 space-y-4 border-t border-border pt-8">
                {[
                  ["Edition", state.edition?.name ?? "Journey Edition"],
                  ["Size", state.edition?.size ?? "10 × 12 in"],
                  ["Pages", state.edition?.pages ?? "120 pages"],
                  ["Photographs", `${state.photoCount || 64}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between text-sm">
                    <span className="eyebrow">{k}</span>
                    <span className="font-serif text-lg">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-border pt-8 space-y-3">
                <div className="flex justify-between"><span>Volume</span><span>${price}</span></div>
                <div className="flex justify-between"><span>Worldwide shipping</span><span>${ship}</span></div>
                <div className="flex justify-between font-serif text-2xl pt-4 border-t border-border">
                  <span>Total</span><span>${total}</span>
                </div>
              </div>

              <p className="mt-8 text-xs text-muted-foreground italic leading-relaxed">
                Each book is made to order in our Florence bindery. We do not hold inventory — your
                volume exists because you commissioned it.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </StudioShell>
  );
}
