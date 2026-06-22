import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { pageCounts, useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/pages")({
  head: () => ({
    meta: [
      { title: "Choose your page count — Stacked Stone" },
      { name: "description", content: "How long should the story be?" },
    ],
  }),
  component: PagesPage,
});

function PagesPage() {
  const navigate = useNavigate();
  const { state, patch } = useStudio();

  return (
    <StudioShell current="/pages">
      <section className="container-edit pt-24 md:pt-32 pb-12">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Step Six · The Length</p>
            <h1 className="display mt-6 text-5xl md:text-7xl">
              How long<br /><span className="italic">should the story be?</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground leading-relaxed">
            Page count quietly guides how many photographs you'll need. We'll show you the recommended
            range on the next step, and the book will breathe accordingly.
          </p>
        </div>
      </section>

      <section className="container-edit pb-32 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-14 pt-14">
          {pageCounts.map((pc, i) => {
            const active = state.pageCount?.pages === pc.pages;
            return (
              <button
                key={pc.pages}
                onClick={() => {
                  patch({ pageCount: pc });
                  navigate({ to: "/upload" });
                }}
                className={`group text-left reveal delay-${(i % 4) + 1} ${i % 2 === 1 ? "md:mt-10" : ""}`}
              >
                <div
                  className={`relative aspect-[3/4] border border-border overflow-hidden transition-colors ${
                    active ? "bg-ink text-background" : "bg-beige/40 hover:bg-beige/80"
                  }`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <p className={`eyebrow ${active ? "!text-background/70" : ""}`}>N° 0{i + 1}</p>
                    <p className="font-serif text-7xl md:text-8xl mt-6 tracking-tight">{pc.pages}</p>
                    <p className={`eyebrow mt-4 ${active ? "!text-background/70" : ""}`}>pages</p>
                  </div>
                  <div className={`absolute bottom-5 left-5 right-5 text-center ${active ? "text-background/80" : "text-muted-foreground"}`}>
                    <p className="text-xs italic">{pc.recommended[0]}–{pc.recommended[1]} photographs</p>
                  </div>
                </div>
                <p className="italic text-foreground/70 mt-6 text-center">{pc.ideal}</p>
                <p className="eyebrow text-center mt-3">{pc.priceDelta === 0 ? "Included" : `+ $${pc.priceDelta}`}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-border pt-8">
          <Link to="/paper" className="btn-ghost text-muted-foreground">← Paper</Link>
        </div>
      </section>
    </StudioShell>
  );
}
