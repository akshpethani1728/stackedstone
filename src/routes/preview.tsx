import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { useStudio } from "@/lib/studio-store";
import bookOpen from "@/assets/book-open.jpg";
import bookStack from "@/assets/book-stack.jpg";
import shelf1 from "@/assets/shelf-1.jpg";
import shelf2 from "@/assets/shelf-2.jpg";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Your volume — Stacked Stone" },
      { name: "description", content: "A first look at your finished book." },
    ],
  }),
  component: PreviewPage,
});

const spreads = [bookOpen, shelf1, shelf2, bookStack];

function PreviewPage() {
  const navigate = useNavigate();
  const { state } = useStudio();
  const [page, setPage] = useState(0);
  const title = state.title || state.destination?.name || "Untitled Volume";

  return (
    <StudioShell current="/preview">
      <section className="bg-beige/50 border-b border-border">
        <div className="container-edit py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Step Four · The First Look</p>
            <h1 className="display mt-6 text-5xl md:text-7xl tracking-tight">
              {title},<br /><span className="italic">bound.</span>
            </h1>
          </div>
          <div className="md:col-span-4 text-muted-foreground leading-relaxed">
            <p>{state.edition?.name ?? "Journey Edition"} · {state.edition?.pages ?? "120 pages"} · {state.edition?.size ?? "10 × 12 in"}</p>
            <p className="mt-2">{state.photoCount || 64} photographs · linen-bound · debossed spine</p>
          </div>
        </div>
      </section>

      <section className="bg-ink text-background py-20 md:py-28">
        <div className="container-edit grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-8 relative">
            <div className="aspect-[16/11] bg-stone-warm/10 overflow-hidden book-shadow relative">
              {spreads.map((s, i) => (
                <img
                  key={i}
                  src={s}
                  alt={`Spread ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    i === page ? "opacity-100" : "opacity-0"
                  }`}
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
              <p className="eyebrow !text-background/60">Cover</p>
              <p className="font-serif italic text-3xl mt-3">{title}</p>
              <p className="text-background/70 mt-2">{state.destination?.region ?? "From your archive"}</p>
            </div>
            <div className="border-t border-background/15 pt-8">
              <p className="eyebrow !text-background/60">Object</p>
              <ul className="mt-4 space-y-3 text-background/85">
                <li>· Linen-wrapped board, debossed</li>
                <li>· 150gsm Munken Pure, uncoated</li>
                <li>· Smyth-sewn signatures</li>
                <li>· Wrapped in muslin, sealed by hand</li>
              </ul>
            </div>
            <div className="border-t border-background/15 pt-8 flex items-end justify-between">
              <div>
                <p className="eyebrow !text-background/60">Total</p>
                <p className="font-serif text-4xl mt-2">${state.edition?.price ?? 149}</p>
              </div>
              <button onClick={() => navigate({ to: "/checkout" })} className="btn-primary !bg-background !text-ink !border-background hover:!bg-transparent hover:!text-background">
                Proceed to checkout
              </button>
            </div>
            <Link to="/upload" className="btn-ghost !text-background/70 mt-2 inline-flex">← Revise photographs</Link>
          </aside>
        </div>
      </section>
    </StudioShell>
  );
}
