import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { useStudio } from "@/stores/studio";
import { useDestinationIds } from "@/hooks/use-catalogue-ids";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import { destinations, REGIONS, getDestination } from "@/data/destination-catalogue";
import type { CatalogueDestination } from "@/data/destination-catalogue";

export const Route = createFileRoute("/destination")({
  head: () => ({
    meta: [
      { title: "Choose your destination — Stacked Stone" },
      { name: "description", content: "An atlas of destinations, bound between covers." },
    ],
  }),
  component: DestinationPage,
});

const STEPS = 8;

function DestinationPage() {
  const navigate = useNavigate();
  const { state, patch, createDraft, bookId, saveStatus } = useStudio();
  useDestinationIds();

  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("india");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const filteredDestinations = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && !activeRegion) return destinations;
    return destinations.filter((d) => {
      if (activeRegion && d.regionId !== activeRegion) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.searchKeywords.some((kw) => kw.toLowerCase().includes(q))
      );
    });
  }, [query, activeRegion]);

  const pick = async (d: CatalogueDestination) => {
    setSelectedSlug(d.slug);
    const { img: _i, searchKeywords: _sk, featured: _f, bookCount: _bc, ...catalog } = d;
    patch({
      destination: {
        slug: d.slug,
        name: d.name,
        region: d.country,
        tagline: d.subtitle,
      },
      cover: undefined,
    });
    if (!bookId) {
      await createDraft();
    }
    navigate({ to: "/create" });
  };

  return (
    <StudioShell current="/destination">
      <SaveIndicator status={saveStatus} />

      {/* 1. Progress Indicator */}
      <div className="container-edit pt-8 md:pt-12 pb-4">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: STEPS }, (_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  i === 0 ? "bg-foreground" : "bg-border"
                }`}
              />
              {i < STEPS - 1 && (
                <div
                  className={`h-px flex-1 ${
                    i === 0 ? "bg-foreground/40" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="text-foreground font-medium">01 · Destination</span>
          <span>02 · Edition</span>
          <span className="hidden sm:inline">03 · Cover</span>
          <span className="hidden md:inline">04 · Material</span>
          <span className="hidden lg:inline">05 · Paper</span>
          <span className="hidden lg:inline">06 · Pages</span>
          <span className="hidden xl:inline">07 · Photographs</span>
          <span className="hidden xl:inline">08 · Preview</span>
        </div>
      </div>

      {/* 2. Main Heading */}
      <section className="container-edit pt-4 pb-8 md:pb-12">
        <h1 className="display text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.08] tracking-tight">
          Every unforgettable book<br />
          <span className="italic font-light">begins with a destination.</span>
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed text-base md:text-lg">
          Choose a place you'd like to live with. New destinations are added each season, set
          in conversation with photographers who know the land.
        </p>
      </section>

      {/* 3. Search */}
      <section className="container-edit pb-8 md:pb-12">
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="7" cy="7" r="5.5" />
              <path d="M11 11l3.5 3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search destinations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-transparent border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* 4. Region Navigation */}
      <div className="container-edit pb-8 md:pb-12">
        <nav className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
          {REGIONS.map((region) => {
            const hasDestinations = destinations.some(
              (d) => d.regionId === region.id
            );
            const isActive = activeRegion === region.id;
            return (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                disabled={!hasDestinations}
                className={`px-5 py-2 text-[0.7rem] uppercase tracking-[0.2em] rounded-full border transition-colors ${
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : hasDestinations
                    ? "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                    : "bg-transparent text-muted-foreground/30 border-border/50 cursor-not-allowed"
                }`}
              >
                {region.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 5 + 6. Destination Grid + Cards */}
      <section className="container-edit pb-20 md:pb-32">
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {filteredDestinations.map((d) => {
              const isSelected = selectedSlug === d.slug;
              return (
                <button
                  key={d.slug}
                  onClick={() => pick(d)}
                  className={`group relative text-left w-full transition-colors ${
                    isSelected ? "opacity-90" : ""
                  }`}
                >
                  <div
                    className={`img-zoom relative aspect-[4/5] overflow-hidden book-shadow rounded-sm ${
                      isSelected ? "ring-2 ring-foreground/60" : ""
                    }`}
                  >
                    <img
                      src={d.img}
                      alt={`${d.name} — ${d.subtitle}`}
                      loading="lazy"
                      width={1600}
                      height={1200}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent/20 to-ink/65" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-8 text-background">
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-background/65">
                        {d.country}
                      </p>
                      <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl mt-1.5 tracking-tight">
                        {d.name}
                      </h3>
                      <p className="italic text-background/80 mt-1 text-sm md:text-base leading-snug">
                        {d.subtitle}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-background"
                      >
                        <path d="M3 7h8M7 3v8" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground italic">
              {query
                ? `No destinations match "${query}".`
                : "No destinations in this region yet."}
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              More chapters being written.
            </p>
          </div>
        )}
      </section>

      {/* 7. Bottom Inspiration */}
      <section className="bg-beige/40 py-20 md:py-28">
        <div className="container-edit">
          <p className="eyebrow text-center">From the studio</p>
          <h2 className="display text-3xl md:text-5xl text-center mt-4 max-w-2xl mx-auto leading-[1.1]">
            Inspiration from<br />
            <span className="italic">this destination</span>
          </h2>
          <p className="text-center text-muted-foreground text-sm mt-4 max-w-lg mx-auto">
            Curated volumes, pairings and stories from our community of travellers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/3] bg-border/40 rounded-sm" />
                <div className="space-y-2">
                  <div className="h-3 w-2/3 bg-border/30 rounded" />
                  <div className="h-2.5 w-1/2 bg-border/20 rounded" />
                  <div className="h-2 w-3/4 bg-border/15 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
