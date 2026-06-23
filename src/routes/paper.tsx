import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import { papers } from "@/data";
import { useStudio } from "@/stores/studio";

export const Route = createFileRoute("/paper")({
  head: () => ({
    meta: [
      { title: "Choose paper — Stacked Stone" },
      { name: "description", content: "The surface your story is printed on." },
    ],
  }),
  component: PaperPage,
});

const images = [
  "https://images.unsplash.com/photo-1581858726786-5bc1f0e77f42?w=600&q=80",
  "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80",
  "https://images.unsplash.com/photo-1581858726786-5bc1f0e77f42?w=600&q=80",
  "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80",
];

function PaperPage() {
  const navigate = useNavigate();
  const { state, patch, saveStatus } = useStudio();

  if (!state.material) {
    return (
      <StudioShell current="/paper">
        <section className="container-edit pt-32 pb-40 text-center">
          <p className="eyebrow">Step Five · The Paper</p>
          <h1 className="display mt-6 text-5xl">Choose a material first.</h1>
          <Link to="/material" className="btn-primary mt-10 inline-flex">Choose material</Link>
        </section>
      </StudioShell>
    );
  }

  return (
    <StudioShell current="/paper">
      <SaveIndicator status={saveStatus} />
      <section className="container-edit pt-24 md:pt-32 pb-16">
        <p className="eyebrow reveal">Step Five · The Page</p>
        <h1 className="display reveal delay-1 mt-6 text-5xl md:text-7xl max-w-3xl">
          The surface your story<br /><span className="italic">lives on.</span>
        </h1>
        <p className="reveal delay-2 mt-8 max-w-md text-muted-foreground leading-relaxed">
          Paper is not a neutral thing. A matte sheet holds shadow differently from a gloss. Your
          photographs deserve the right surface.
        </p>
      </section>

      <section className="container-edit pb-32 md:pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {papers.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => {
                patch({ paper: p });
                navigate({ to: "/pages" });
              }}
              className={`group text-left reveal delay-${(i % 4) + 1}`}
            >
              <div className="img-zoom aspect-[5/3] overflow-hidden book-shadow">
                <img src={images[i]} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-ink/5" />
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                  <span className="eyebrow !text-background/90">N° 0{i + 1}</span>
                  <span className="eyebrow !text-background/85">{p.priceDelta === 0 ? "Included" : `+ ₹${p.priceDelta}`}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-background/75 backdrop-blur-sm p-4 rounded-sm">
                    <h3 className="font-serif text-2xl md:text-3xl">{p.name}</h3>
                    <p className="text-xs text-foreground/70 mt-1">{p.weight} · {p.finish}</p>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed italic">{p.bestFor}</p>
              <span className="btn-ghost mt-6 inline-flex">Select paper →</span>
            </button>
          ))}
        </div>
      </section>
    </StudioShell>
  );
}
