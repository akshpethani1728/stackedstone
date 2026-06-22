import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { BookMockup } from "@/components/studio/BookMockup";
import { coversFor, extraOptions, useStudio, type Extras } from "@/lib/studio-store";
import bookOpen from "@/assets/book-open.jpg";
import shelf1 from "@/assets/shelf-1.jpg";
import shelf2 from "@/assets/shelf-2.jpg";
import bookStack from "@/assets/book-stack.jpg";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Your volume — Stacked Stone" },
      { name: "description", content: "A first look at your finished book." },
    ],
  }),
  component: PreviewPage,
});

const fallbackSpreads = [bookOpen, shelf1, shelf2, bookStack];

function PreviewPage() {
  const navigate = useNavigate();
  const { state, patch } = useStudio();
  const [page, setPage] = useState(0);
  const title = state.title || state.destination?.name || "Untitled Volume";

  const cover = state.cover ?? coversFor(state.destination?.slug)[0];
  const coverPhoto = state.photos?.[0];
  const spreads = useMemo(() => {
    const userSpreads = state.photos ?? [];
    return userSpreads.length >= 2 ? userSpreads.slice(0, 8) : fallbackSpreads;
  }, [state.photos]);

  const totalExtras = extraOptions.reduce(
    (acc, e) => acc + (state.extras[e.slug as keyof Extras] ? e.price : 0),
    0,
  );
  const total =
    (state.edition?.price ?? 149) +
    (state.material?.priceDelta ?? 0) +
    (state.paper?.priceDelta ?? 0) +
    (state.pageCount?.priceDelta ?? 0) +
    totalExtras;

  if (!cover) {
    return (
      <StudioShell current="/preview">
        <section className="container-edit pt-32 pb-40 text-center">
          <p className="eyebrow">Step Eight · Preview</p>
          <h1 className="display mt-6 text-5xl">Choose your destination and cover first.</h1>
          <Link to="/destination" className="btn-primary mt-10 inline-flex">Begin</Link>
        </section>
      </StudioShell>
    );
  }

  const toggleExtra = (slug: keyof Extras) => {
    patch({ extras: { ...state.extras, [slug]: !state.extras[slug] } });
  };

  return (
    <StudioShell current="/preview">
      {/* Cover hero */}
      <section className="bg-beige/40 border-b border-border">
        <div className="container-edit py-20 md:py-28 grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-7">
            <BookMockup
              cover={cover}
              destination={state.destination}
              edition={state.edition}
              title={title}
              photo={coverPhoto}
              size="lg"
            />
          </div>
          <div className="md:col-span-5">
            <p className="eyebrow">Step Eight · The First Look</p>
            <h1 className="display mt-6 text-5xl md:text-6xl tracking-tight">
              {title},<br /><span className="italic">in your hands.</span>
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              This is your book — your photograph on the cover, your name on the spine. Turn the spreads
              below to see how it will read.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 max-w-md">
              <Spec label="Edition" value={state.edition?.name ?? "—"} />
              <Spec label="Destination" value={state.destination?.name ?? "—"} />
              <Spec label="Cover" value={cover.name} />
              <Spec label="Material" value={state.material?.name ?? "—"} />
              <Spec label="Paper" value={state.paper?.name ?? "—"} />
              <Spec label="Pages" value={state.pageCount ? `${state.pageCount.pages}` : "—"} />
            </div>
          </div>
        </div>
      </section>

      {/* Spread viewer */}
      <section className="bg-ink text-background py-20 md:py-28">
        <div className="container-edit grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-8 relative">
            <div className="aspect-[16/11] bg-stone-warm/10 overflow-hidden book-shadow relative">
              {spreads.map((s, i) => (
                <img
                  key={i}
                  src={s}
                  alt={`Spread ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === page ? "opacity-100" : "opacity-0"}`}
                />
              ))}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-ink/30" />
            </div>
            <div className="mt-8 flex items-center justify-between text-background/70">
              <button onClick={() => setPage((p) => (p - 1 + spreads.length) % spreads.length)} className="btn-ghost !text-background/80">← Prev spread</button>
              <span className="eyebrow !text-background/60">
                Spread {String(page + 1).padStart(2, "0")} / {String(spreads.length).padStart(2, "0")}
              </span>
              <button onClick={() => setPage((p) => (p + 1) % spreads.length)} className="btn-ghost !text-background/80">Next spread →</button>
            </div>
          </div>

          <aside className="md:col-span-4 space-y-10">
            <div>
              <p className="eyebrow !text-background/60">Object</p>
              <ul className="mt-4 space-y-3 text-background/85">
                <li>· {state.edition?.size ?? "10 × 12 in"} · {state.edition?.name?.includes("Collector") ? "Portrait" : "Landscape"}</li>
                <li>· {state.paper?.weight ?? "170 gsm"} {state.paper?.name ?? "Premium Matte"}</li>
                <li>· Smyth-sewn signatures · lay-flat binding</li>
                <li>· {state.material?.name ?? "Linen Hardcover"}, debossed spine</li>
                <li>· Printed in India · arrives in 14–18 days</li>
              </ul>
            </div>
            <Link to="/upload" className="btn-ghost !text-background/70 inline-flex">← Revise photographs</Link>
          </aside>
        </div>
      </section>

      {/* Extras + checkout */}
      <section className="container-edit py-20 md:py-28 grid md:grid-cols-12 gap-16">
        <div className="md:col-span-7">
          <p className="eyebrow">Add to your volume</p>
          <h2 className="display mt-4 text-4xl md:text-5xl">Quiet upgrades.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            None of these are required. Each is made by the same hands that bind your book.
          </p>

          <ul className="mt-12 divide-y divide-border border-y border-border">
            {extraOptions.map((e) => {
              const active = state.extras[e.slug as keyof Extras] as boolean;
              return (
                <li key={e.slug}>
                  <button
                    onClick={() => toggleExtra(e.slug as keyof Extras)}
                    className="w-full py-8 flex items-center justify-between gap-8 group"
                  >
                    <div className="text-left">
                      <p className="font-serif text-2xl">{e.name}</p>
                      <p className="text-muted-foreground mt-1 italic">{e.note}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-serif text-xl">+ ${e.price}</span>
                      <span
                        className={`h-5 w-5 border transition-colors ${active ? "bg-foreground border-foreground" : "border-foreground/40 group-hover:border-foreground"}`}
                        aria-hidden
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-10">
            <label className="eyebrow block mb-3">Personal gift message (optional)</label>
            <textarea
              value={state.extras.giftMessage}
              onChange={(e) => patch({ extras: { ...state.extras, giftMessage: e.target.value } })}
              rows={3}
              placeholder="A line in your own hand. Letterpressed on a card, tucked inside the cover."
              className="w-full bg-transparent border-b border-foreground/30 focus:border-foreground outline-none font-serif italic text-xl py-3 resize-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        <aside className="md:col-span-4 md:col-start-9 md:sticky md:top-32 self-start">
          <div className="border border-border p-10 bg-beige/30">
            <p className="eyebrow">Your volume</p>
            <h3 className="font-serif italic text-3xl mt-3">{title}</h3>
            <p className="text-muted-foreground mt-1">{state.destination?.region ?? "—"}</p>

            <div className="mt-10 border-t border-border pt-8 space-y-3 text-sm">
              <Row k="Edition"     v={state.edition?.name}     a={`$${state.edition?.price ?? 0}`} />
              <Row k="Cover"       v={cover.name} />
              <Row k="Material"    v={state.material?.name}    a={state.material?.priceDelta ? `+ $${state.material.priceDelta}` : "Included"} />
              <Row k="Paper"       v={state.paper?.name}       a={state.paper?.priceDelta ? `+ $${state.paper.priceDelta}` : "Included"} />
              <Row k="Pages"       v={state.pageCount ? `${state.pageCount.pages} pages` : "—"} a={state.pageCount?.priceDelta ? `+ $${state.pageCount.priceDelta}` : "Included"} />
              <Row k="Photographs" v={`${state.photoCount || 0}`} />
              {extraOptions.filter((e) => state.extras[e.slug as keyof Extras]).map((e) => (
                <Row key={e.slug} k="Extra" v={e.name} a={`+ $${e.price}`} />
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-6 flex items-baseline justify-between">
              <span className="eyebrow">Subtotal</span>
              <span className="font-serif text-3xl">${total}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Worldwide shipping calculated at checkout.</p>

            <button onClick={() => navigate({ to: "/checkout" })} className="btn-primary mt-8 w-full">
              Proceed to checkout
            </button>
            <p className="mt-6 text-xs text-muted-foreground italic leading-relaxed">
              Estimated delivery: 14–18 days. Printed in India, finished by hand.
            </p>
          </div>
        </aside>
      </section>
    </StudioShell>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="font-serif text-lg mt-1">{value}</p>
    </div>
  );
}

function Row({ k, v, a }: { k: string; v?: string; a?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="eyebrow shrink-0">{k}</span>
      <span className="font-serif text-base text-right text-foreground/90 flex-1">{v ?? "—"}</span>
      {a && <span className="text-xs text-muted-foreground shrink-0">{a}</span>}
    </div>
  );
}
