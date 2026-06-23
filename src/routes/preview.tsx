import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { BookMockup } from "@/components/studio/BookMockup";
import { BookPreview } from "@/components/studio/BookPreview";
import { useStudio, type Extras } from "@/stores/studio";
import { coversFor, editions, materials, papers, pageCounts, extraOptions } from "@/data";
import { destinations } from "@/data/destinations";
import { subtotal } from "@/lib/pricing";
import { BookGenerator } from "@/services/book-generator";
import { LayoutEngine } from "@/services/layout-engine";
import { config } from "@/config";
import type { BookPreview as BookPreviewType, GenerationStatus } from "@/types/preview";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Your volume — Stacked Stone" },
      { name: "description", content: "A first look at your finished book." },
    ],
  }),
  component: PreviewRoute,
});

function buildSamplePreview(totalPages: number, gallery: string[]): BookPreviewType {
  const photos = Array.from({ length: Math.max(totalPages + 4, 12) }, (_, i) => ({
    id: `sample-${i}`,
    storage_url: gallery[i % gallery.length],
    sort_order: i,
  }));
  return LayoutEngine.generate({ photos, totalPages, bookId: "sample" });
}

function PreviewRoute() {
  const navigate = useNavigate();
  const { state, patch } = useStudio();
  const [preview, setPreview] = useState<BookPreviewType | null>(null);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const genRef = useRef(false);

  const bookId = state.bookId;
  const isDemo = !bookId;

  // Fallbacks so the page is always renderable on first visit.
  const destination = state.destination ?? destinations[0];
  const edition = state.edition ?? editions[1];
  const cover = state.cover ?? coversFor(destination?.slug)[0];
  const material = state.material ?? materials[0];
  const paper = state.paper ?? papers[0];
  const pageCountObj = state.pageCount ?? pageCounts[2];
  const totalPages = pageCountObj.pages;

  const title = state.title || destination?.name || "Untitled Volume";
  const coverPhoto = state.photos?.[0] ?? cover?.image;
  const sampleGallery: string[] = (destination?.gallery ?? [cover?.image]).filter(Boolean);

  const doGenerate = useCallback(async () => {
    if (isDemo) {
      setStatus("generating");
      setPreview(buildSamplePreview(totalPages, sampleGallery));
      setStatus("ready");
      return;
    }
    if (!bookId) return;
    setStatus("generating");
    setError(null);
    try {
      const result = await BookGenerator.generate(bookId, totalPages);
      setPreview(result);
      setStatus("ready");
    } catch (err: any) {
      setError(err?.message ?? "Failed to generate preview");
      setStatus("error");
    }
  }, [bookId, totalPages, isDemo, sampleGallery]);

  useEffect(() => {
    if (genRef.current) return;
    genRef.current = true;

    if (isDemo) {
      setPreview(buildSamplePreview(totalPages, sampleGallery));
      setStatus("ready");
      return;
    }

    BookGenerator.loadOrGenerate(bookId!, totalPages)
      .then((p) => { setPreview(p); setStatus("ready"); })
      .catch((err) => {
        if (err?.message?.includes("no photos")) {
          // Fall back to a sample so the page is never empty.
          setPreview(buildSamplePreview(totalPages, sampleGallery));
          setStatus("ready");
          return;
        }
        BookGenerator.generate(bookId!, totalPages)
          .then((p) => { setPreview(p); setStatus("ready"); })
          .catch((e2) => { setError(e2?.message ?? "Failed"); setStatus("error"); });
      });
  }, [bookId, totalPages, isDemo, sampleGallery]);

  const total = subtotal({ ...state, edition, material, paper, pageCount: pageCountObj });
  const hasCheckout = config.featureFlags.enableCheckout;

  return (
    <StudioShell current="/preview">
      {/* Cover hero */}
      <section className="bg-beige/40 border-b border-border">
        <div className="container-edit py-20 md:py-28 grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-7">
            <BookMockup
              cover={cover}
              destination={destination}
              edition={edition}
              title={title}
              photo={coverPhoto}
              size="lg"
            />
          </div>
          <div className="md:col-span-5">
            <p className="eyebrow">Step Eight · The First Look{isDemo ? " · Sample" : ""}</p>
            <h1 className="display mt-6 text-5xl md:text-6xl tracking-tight">
              {title},<br /><span className="italic">in your hands.</span>
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              {isDemo
                ? "A sample volume, arranged from our archive. Begin a draft to see your own photographs bound this way."
                : "This is your book — your photograph on the cover, your name on the spine. Turn the spreads below to see how it will read."}
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 max-w-md">
              <Spec label="Edition" value={edition?.name ?? "—"} />
              <Spec label="Destination" value={destination?.name ?? "—"} />
              <Spec label="Cover" value={cover?.name ?? "—"} />
              <Spec label="Material" value={material?.name ?? "—"} />
              <Spec label="Paper" value={paper?.name ?? "—"} />
              <Spec label="Pages" value={pageCountObj ? `${pageCountObj.pages}` : "—"} />
              <Spec label="Photos" value={`${isDemo ? "Sample" : state.photoCount || 0}`} />
            </div>
            {isDemo && (
              <Link to="/destination" className="btn-primary mt-10 inline-flex">Begin your own</Link>
            )}
          </div>

        </div>
      </section>

      {/* Generation loading */}
      {status === "generating" && (
        <section className="bg-ink text-background py-32">
          <div className="container-edit text-center">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-8 h-8 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              <span className="font-serif italic text-3xl text-background/80">Binding your book…</span>
            </div>
            <p className="text-background/50 text-sm max-w-md mx-auto">
              Arranging your photographs across {totalPages} pages.
            </p>
          </div>
        </section>
      )}

      {/* Error state */}
      {status === "error" && (
        <section className="bg-ink text-background py-32">
          <div className="container-edit text-center">
            <p className="font-serif italic text-3xl text-background/80 mb-4">Something went wrong</p>
            <p className="text-background/50 text-sm max-w-md mx-auto mb-8">{error}</p>
            <button onClick={doGenerate} className="btn-ghost !text-background/80">
              Try again
            </button>
          </div>
        </section>
      )}

      {/* No photos state */}
      {status === "idle" && (
        <section className="bg-ink text-background py-32">
          <div className="container-edit text-center">
            <p className="font-serif italic text-3xl text-background/80 mb-4">
              No photographs yet
            </p>
            <p className="text-background/50 text-sm max-w-md mx-auto mb-8">
              Upload your photographs before generating the preview.
            </p>
            <Link to="/upload" className="btn-ghost !text-background/80 inline-flex">
              Add photographs →
            </Link>
          </div>
        </section>
      )}

      {/* Book preview */}
      {status === "ready" && preview && (
        <section>
          <BookPreview preview={preview} coverUrl={coverPhoto} />

          <div className="container-edit py-10 flex items-center justify-between border-b border-border">
            <Link to="/upload" className="btn-ghost text-muted-foreground">← Revise photographs</Link>
            <button
              onClick={doGenerate}
              className="text-[0.6rem] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Regenerate preview
            </button>
          </div>
        </section>
      )}

      {/* Extras + pricing */}
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
                    onClick={() => toggleExtra(e.slug as keyof Extras, patch, state.extras)}
                    className="w-full py-8 flex items-center justify-between gap-8 group"
                  >
                    <div className="text-left">
                      <p className="font-serif text-2xl">{e.name}</p>
                      <p className="text-muted-foreground mt-1 italic">{e.note}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-serif text-xl">+ ₹{e.price}</span>
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
              <Row k="Edition"     v={state.edition?.name}     a={`₹${state.edition?.price ?? 0}`} />
              <Row k="Cover"       v={cover.name} />
              <Row k="Material"    v={state.material?.name}    a={state.material?.priceDelta ? `+ ₹${state.material.priceDelta}` : "Included"} />
              <Row k="Paper"       v={state.paper?.name}       a={state.paper?.priceDelta ? `+ ₹${state.paper.priceDelta}` : "Included"} />
              <Row k="Pages"       v={state.pageCount ? `${state.pageCount.pages} pages` : "—"} a={state.pageCount?.priceDelta ? `+ ₹${state.pageCount.priceDelta}` : "Included"} />
              <Row k="Photographs" v={`${state.photoCount || 0}`} />
              {extraOptions.filter((e) => state.extras[e.slug as keyof Extras]).map((e) => (
                <Row key={e.slug} k="Extra" v={e.name} a={`+ ₹${e.price}`} />
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-6 flex items-baseline justify-between">
              <span className="eyebrow">Subtotal</span>
              <span className="font-serif text-3xl">₹{total}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Inclusive of all taxes. Shipping across India — ₹499.</p>

            {hasCheckout ? (
              <button onClick={() => navigate({ to: "/checkout" })} className="btn-primary mt-8 w-full">
                Proceed to checkout
              </button>
            ) : (
              <button disabled className="btn-primary mt-8 w-full opacity-40 cursor-not-allowed">
                Checkout coming soon
              </button>
            )}
            <p className="mt-6 text-xs text-muted-foreground italic leading-relaxed">
              Estimated delivery: 10–14 days. Printed in India, finished by hand.
            </p>
          </div>
        </aside>
      </section>
    </StudioShell>
  );
}

function toggleExtra(slug: string, patch: any, extras: Extras) {
  patch({ extras: { ...extras, [slug]: !(extras as any)[slug] } });
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
