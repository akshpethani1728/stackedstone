import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { papers, useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/paper")({
  head: () => ({
    meta: [
      { title: "Choose your paper — Stacked Stone" },
      { name: "description", content: "Four archival stocks. One quiet decision." },
    ],
  }),
  component: PaperPage,
});

function PaperPage() {
  const navigate = useNavigate();
  const { state, patch } = useStudio();

  return (
    <StudioShell current="/paper">
      <section className="container-edit pt-24 md:pt-32 pb-12">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Step Five · The Paper</p>
            <h1 className="display mt-6 text-5xl md:text-7xl">
              The stock<br /><span className="italic">your light is printed on.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground leading-relaxed">
            Every sheet is FSC-certified and acid-free. The difference is in how the page receives the
            photograph — chalky, satin, lustrous, or museum.
          </p>
        </div>
      </section>

      <section className="container-edit pb-32 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 pt-14">
          {papers.map((p, i) => {
            const active = state.paper?.slug === p.slug;
            return (
              <button
                key={p.slug}
                onClick={() => {
                  patch({ paper: p });
                  navigate({ to: "/pages" });
                }}
                className={`group text-left reveal delay-${(i % 4) + 1}`}
              >
                <div className="img-zoom relative aspect-[5/4] book-shadow overflow-hidden bg-stone-warm">
                  <img src={p.texture} alt={p.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/40" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-background">
                    <div>
                      <p className="eyebrow !text-background/75">{p.weight}</p>
                      <p className="font-serif italic text-2xl mt-1">{p.finish}</p>
                    </div>
                    <span className="eyebrow !text-background/85">{p.priceDelta === 0 ? "Included" : `+ $${p.priceDelta}`}</span>
                  </div>
                  {active && (
                    <span className="absolute top-5 right-5 eyebrow !text-background/95 bg-ink/40 px-3 py-1 backdrop-blur-sm">Selected</span>
                  )}
                </div>
                <h3 className="font-serif text-3xl tracking-tight mt-8">{p.name}</h3>
                <p className="text-muted-foreground leading-relaxed mt-2 max-w-md">
                  <span className="italic text-foreground/70">Best for </span>{p.bestFor}
                </p>
                <span className="btn-ghost mt-6 inline-flex">Select →</span>
              </button>
            );
          })}
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-border pt-8">
          <Link to="/material" className="btn-ghost text-muted-foreground">← Material</Link>
        </div>
      </section>
    </StudioShell>
  );
}
