import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import { pageCounts } from "@/data";
import { useStudio } from "@/stores/studio";

export const Route = createFileRoute("/pages")({
  head: () => ({
    meta: [
      { title: "Choose page count — Stacked Stone" },
      { name: "description", content: "How many pages will your story fill?" },
    ],
  }),
  component: PagesPage,
});

const images = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
  "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&q=80",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80",
];

function PagesPage() {
  const navigate = useNavigate();
  const { state, patch, saveStatus } = useStudio();

  if (!state.paper) {
    return (
      <StudioShell current="/pages">
        <section className="container-edit pt-32 pb-40 text-center">
          <p className="eyebrow">Step Six · The Pages</p>
          <h1 className="display mt-6 text-5xl">Choose a paper first.</h1>
          <Link to="/paper" className="btn-primary mt-10 inline-flex">Choose paper</Link>
        </section>
      </StudioShell>
    );
  }

  return (
    <StudioShell current="/pages">
      <SaveIndicator status={saveStatus} />
      <section className="container-edit pt-24 md:pt-32 pb-16">
        <p className="eyebrow reveal">Step Six · The Pages</p>
        <h1 className="display reveal delay-1 mt-6 text-5xl md:text-7xl max-w-3xl">
          How many pages<br /><span className="italic">does your story need?</span>
        </h1>
        <p className="reveal delay-2 mt-8 max-w-md text-muted-foreground leading-relaxed">
          Enough for each image to breathe. Not so many that the book feels thin.
        </p>
      </section>

      <section className="container-edit pb-32 md:pb-48">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {pageCounts.map((pc, i) => (
            <button
              key={pc.pages}
              onClick={() => {
                patch({ pageCount: pc });
                navigate({ to: "/upload" });
              }}
              className={`group text-left reveal delay-${(i % 4) + 1} ${i % 2 === 1 ? "md:mt-10" : ""}`}
            >
              <div className={`relative aspect-[3/4] border border-border overflow-hidden transition-colors ${
                state.pageCount?.pages === pc.pages ? "border-foreground" : "group-hover:border-foreground/50"
              }`}
              >
                <img src={images[i]} alt={pc.label} className="h-full w-full object-cover opacity-20" loading="lazy" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="eyebrow !text-foreground/70">N° 0{i + 1}</p>
                  <p className="font-serif text-5xl md:text-6xl mt-6">{pc.pages}</p>
                  <p className="eyebrow mt-4">pages</p>
                  <div className={`absolute bottom-5 left-5 right-5 text-center`}>
                    <p className="text-xs italic text-muted-foreground">{pc.ideal}</p>
                  </div>
                </div>
              </div>
              <p className="italic text-foreground/70 mt-6 text-center">{pc.ideal}</p>
              <p className="eyebrow text-center mt-3">{pc.priceDelta === 0 ? "Included" : `+ ₹${pc.priceDelta}`}</p>
            </button>
          ))}
        </div>
      </section>
    </StudioShell>
  );
}
