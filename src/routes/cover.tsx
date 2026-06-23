import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import { BookMockup } from "@/components/studio/BookMockup";
import { coversFor } from "@/data";
import { useStudio } from "@/stores/studio";

export const Route = createFileRoute("/cover")({
  head: () => ({
    meta: [
      { title: "Choose your cover — Stacked Stone" },
      { name: "description", content: "Curated cover designs for your volume." },
    ],
  }),
  component: CoverPage,
});

function CoverPage() {
  const navigate = useNavigate();
  const { state, patch, saveStatus } = useStudio();
  const covers = coversFor(state.destination?.slug);

  if (!state.destination) {
    return (
      <StudioShell current="/cover">
        <section className="container-edit pt-32 pb-40 text-center">
          <p className="eyebrow">Step Three · The Cover</p>
          <h1 className="display mt-6 text-5xl">Choose a destination first.</h1>
          <Link to="/destination" className="btn-primary mt-10 inline-flex">Choose destination</Link>
        </section>
      </StudioShell>
    );
  }

  return (
    <StudioShell current="/cover">
      <SaveIndicator status={saveStatus} />
      <section className="container-edit pt-24 md:pt-32 pb-12">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Step Three · The Cover</p>
            <h1 className="display mt-6 text-5xl md:text-7xl">
              The cover<br /><span className="italic">of your {state.destination.name}.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground leading-relaxed">
            Each cover is designed in-house — typography, palette and crop chosen to sit beside the book
            on the shelf, not just to fit it.
          </p>
        </div>
      </section>

      <section className="container-edit pb-32 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-20 pt-16">
          {covers.map((c, i) => (
            <button
              key={c.slug}
              onClick={() => {
                patch({ cover: c });
                navigate({ to: "/material" });
              }}
              className={`group text-left reveal delay-${(i % 4) + 1} ${i % 2 === 1 ? "md:mt-12" : ""}`}
            >
              <div className="transition-transform duration-700 group-hover:-translate-y-2">
                <BookMockup cover={c} destination={state.destination} edition={state.edition} title={state.destination?.name} size="md" />
              </div>
              <div className="mt-10 border-t border-border pt-5 flex items-baseline justify-between">
                <span className="eyebrow">N° 0{i + 1}</span>
                <span className="eyebrow">Cover</span>
              </div>
              <h3 className="font-serif text-3xl tracking-tight mt-3">{c.name}</h3>
              <p className="italic text-muted-foreground mt-2">{c.mood}</p>
              <span className="btn-ghost mt-6 inline-flex">Select →</span>
            </button>
          ))}
        </div>
      </section>
    </StudioShell>
  );
}
