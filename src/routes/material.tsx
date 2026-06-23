import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import { materials } from "@/data";
import { useStudio } from "@/stores/studio";

export const Route = createFileRoute("/material")({
  head: () => ({
    meta: [
      { title: "Choose material — Stacked Stone" },
      { name: "description", content: "The feel of your book, chosen by hand." },
    ],
  }),
  component: MaterialPage,
});

function MaterialPage() {
  const navigate = useNavigate();
  const { state, patch, saveStatus } = useStudio();

  if (!state.cover) {
    return (
      <StudioShell current="/material">
        <section className="container-edit pt-32 pb-40 text-center">
          <p className="eyebrow">Step Four · The Material</p>
          <h1 className="display mt-6 text-5xl">Choose a cover first.</h1>
          <Link to="/cover" className="btn-primary mt-10 inline-flex">Choose cover</Link>
        </section>
      </StudioShell>
    );
  }

  return (
    <StudioShell current="/material">
      <SaveIndicator status={saveStatus} />
      <section className="container-edit pt-24 md:pt-32 pb-16">
        <p className="eyebrow reveal">Step Four · The Material</p>
        <h1 className="display reveal delay-1 mt-6 text-5xl md:text-7xl max-w-3xl">
          What your book<br /><span className="italic">feels like.</span>
        </h1>
        <p className="reveal delay-2 mt-8 max-w-md text-muted-foreground leading-relaxed">
          The material is the first thing a hand feels. Each one changes the weight, the texture, and the
          way light falls on the spine.
        </p>
      </section>

      <section className="container-edit pb-32 md:pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {materials.map((m, i) => (
            <button
              key={m.slug}
              onClick={() => {
                patch({ material: m });
                navigate({ to: "/paper" });
              }}
              className={`group text-left reveal delay-${(i % 4) + 1}`}
            >
              <div className="img-zoom aspect-[4/3] relative overflow-hidden book-shadow"
                style={{ background: `linear-gradient(135deg, ${m.swatch}aa 0%, ${m.swatch}33 60%, transparent 100%)` }}
              >
                <div className="absolute inset-0 bg-ink/5" />
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                  <span className="eyebrow !text-background/90">N° 0{i + 1}</span>
                  <span className="eyebrow !text-background/90">{m.priceDelta === 0 ? "Included" : `+ ₹${m.priceDelta}`}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-serif text-3xl md:text-4xl text-foreground">{m.name}</h3>
                  <p className="text-sm text-foreground/70 mt-2 italic">{m.feel}</p>
                </div>
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed">{m.description}</p>
              <span className="btn-ghost mt-6 inline-flex">Select material →</span>
            </button>
          ))}
        </div>
      </section>
    </StudioShell>
  );
}
