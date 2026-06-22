import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { materials, useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/material")({
  head: () => ({
    meta: [
      { title: "Choose your material — Stacked Stone" },
      { name: "description", content: "The feel of the book, before it is opened." },
    ],
  }),
  component: MaterialPage,
});

function MaterialPage() {
  const navigate = useNavigate();
  const { state, patch } = useStudio();

  return (
    <StudioShell current="/material">
      <section className="container-edit pt-24 md:pt-32 pb-12">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Step Four · The Material</p>
            <h1 className="display mt-6 text-5xl md:text-7xl">
              The feel of it,<br /><span className="italic">before it opens.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground leading-relaxed">
            The cover is the first thing a guest will touch. Choose the texture you want the room to
            remember.
          </p>
        </div>
      </section>

      <section className="container-edit pb-32 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 pt-14">
          {materials.map((m, i) => {
            const active = state.material?.slug === m.slug;
            return (
              <button
                key={m.slug}
                onClick={() => {
                  patch({ material: m });
                  navigate({ to: "/paper" });
                }}
                className={`group text-left reveal delay-${(i % 4) + 1}`}
              >
                <div className="img-zoom relative aspect-[5/4] book-shadow overflow-hidden">
                  <img src={m.texture} alt={m.name} className="h-full w-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${m.swatch}aa 0%, ${m.swatch}33 60%, transparent 100%)`,
                    }}
                  />
                  <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                    <span className="eyebrow !text-background/90">N° 0{i + 1}</span>
                    <span className="eyebrow !text-background/90">{m.priceDelta === 0 ? "Included" : `+ $${m.priceDelta}`}</span>
                  </div>
                  {active && (
                    <span className="absolute bottom-5 right-5 eyebrow !text-background/95 bg-ink/40 px-3 py-1 backdrop-blur-sm">Selected</span>
                  )}
                </div>
                <h3 className="font-serif text-3xl tracking-tight mt-8">{m.name}</h3>
                <p className="italic text-foreground/70 mt-2">{m.feel}</p>
                <p className="text-muted-foreground leading-relaxed mt-3 max-w-md">{m.description}</p>
                <span className="btn-ghost mt-6 inline-flex">Select →</span>
              </button>
            );
          })}
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-border pt-8">
          <Link to="/cover" className="btn-ghost text-muted-foreground">← Cover</Link>
          <p className="eyebrow">Leather edition · arriving 2027</p>
        </div>
      </section>
    </StudioShell>
  );
}
