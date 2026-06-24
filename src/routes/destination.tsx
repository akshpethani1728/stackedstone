import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { useStudio } from "@/stores/studio";
import { useDestinationIds } from "@/hooks/use-catalogue-ids";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import { destinations, REGIONS } from "@/data/destination-catalogue";
import type { CatalogueDestination } from "@/data/destination-catalogue";
import bookStack from "@/assets/book-stack.jpg";
import bookOpen from "@/assets/book-open.jpg";
import shelf1 from "@/assets/shelf-1.jpg";
import shelf2 from "@/assets/shelf-2.jpg";
import bookKyoto from "@/assets/book-kyoto.jpg";
import bookIceland from "@/assets/book-iceland.jpg";
import bookMorocco from "@/assets/book-morocco.jpg";

export const Route = createFileRoute("/destination")({
  head: () => ({
    meta: [
      { title: "Choose your destination — Stacked Stone" },
      { name: "description", content: "An atlas of destinations, bound between covers." },
    ],
  }),
  component: DestinationPage,
});

type InspirationBook = {
  id: number;
  title: string;
  author: string;
  location: string;
  regionId: string;
  description: string;
  img: string;
  copies: number;
  review: string;
  reviewer: string;
};

const allInspirationBooks: InspirationBook[] = [
  { id: 1, title: "The Valley of Warm Light", author: "Ananya Sharma", location: "Kashmir", regionId: "india", description: "A photographic journey through Kashmir's four seasons — snow, bloom, monsoon and autumn gold — captured over two years.", img: bookStack, copies: 312, review: "The colours came out beautifully. Feels like we're back in Gulmarg.", reviewer: "Priya M." },
  { id: 2, title: "Sandstone Chronicles", author: "Vikram Rathore", location: "Rajasthan", regionId: "india", description: "Forty days across Rajasthan's great forts, from the amber walls of Jaipur to the golden ramparts of Jaisalmer at dusk.", img: bookOpen, copies: 287, review: "Every page transports me to those sun-drenched afternoons.", reviewer: "Arjun K." },
  { id: 3, title: "The Last Houseboat", author: "Maya Nair", location: "Kerala", regionId: "india", description: "Seven days on the backwaters — coconut palms, village life and the quiet rhythm of the houseboat.", img: shelf1, copies: 198, review: "My parents cried when they saw it. Best gift I've ever given.", reviewer: "Rohan D." },
  { id: 4, title: "Monasteries in the Clouds", author: "Tashi Dorje", location: "Ladakh", regionId: "india", description: "A journey through the high Himalayas, where prayer flags dance and monasteries perch on cliffs.", img: bookIceland, copies: 156, review: "The blue of Pangong Lake printed exactly as I remember it.", reviewer: "Neha S." },
  { id: 5, title: "The Stillness of Bamboo", author: "Yuki Tanaka", location: "Kyoto, Japan", regionId: "asia", description: "Temple gardens at dawn measured in footsteps — where moss grows on stone and the only sound is water touching granite.", img: bookKyoto, copies: 198, review: "This book captures the silence of Kyoto better than my memory could.", reviewer: "Emma L." },
  { id: 6, title: "Island of Serendipity", author: "Dinesh Perera", location: "Sri Lanka", regionId: "asia", description: "Tea plantations rolling into elephant corridors, and the Indian Ocean lapping golden shores.", img: shelf2, copies: 143, review: "The tea estate photos look like paintings.", reviewer: "Sarah W." },
  { id: 7, title: "Rice Terraces and Rain", author: "Wayan Sudana", location: "Bali, Indonesia", regionId: "asia", description: "Ubud's rice terraces, temple dances and the frangipani-scented air of the Island of the Gods.", img: bookOpen, copies: 223, review: "My Bali album is now my most treasured possession.", reviewer: "Sophie A." },
  { id: 8, title: "Fjord Light", author: "Erik Nordheim", location: "Norway", regionId: "europe", description: "Chasing the midnight sun along the Norwegian coast, from Bergen to the Lofoten Islands.", img: bookIceland, copies: 167, review: "The aurora shots are unreal. Never thought my phone photos could look this good.", reviewer: "Michael T." },
  { id: 9, title: "The Colour of the Aegean", author: "Eleni Katsaros", location: "Greece", regionId: "europe", description: "Whitewashed villages, blue domes and the endless Mediterranean — a love letter to the Greek islands.", img: shelf1, copies: 201, review: "Exactly the quality I hoped for. My Santorini trip lives forever.", reviewer: "Claire D." },
  { id: 10, title: "Blue Streets of the Sahara", author: "Layla Ben Ali", location: "Morocco", regionId: "africa", description: "From the blue city of Chefchaouen to the dunes of Merzouga — a journey through colour and light.", img: bookMorocco, copies: 134, review: "The Marrakech market photos are so vivid you can almost smell the spices.", reviewer: "Omar F." },
  { id: 11, title: "Highway One at Sunset", author: "Mia Chen", location: "California", regionId: "americas", description: "The Pacific Coast Highway, redwood forests and the golden light of the California coast.", img: shelf2, copies: 178, review: "The Big Sur pages are simply stunning.", reviewer: "David L." },
  { id: 12, title: "The Long White Cloud", author: "James Fletcher", location: "New Zealand", regionId: "oceania", description: "Milford Sound, Mount Cook and the wild South Island — an adventure through Aotearoa.", img: bookStack, copies: 112, review: "Every page makes me want to book another flight.", reviewer: "Kate R." },
];

function getBooksForRegion(regionId: string): InspirationBook[] {
  return allInspirationBooks.filter((b) => b.regionId === regionId);
}

const suggestions = [
  { label: "Beach escapes", keywords: "beach coast sea sand tropical" },
  { label: "Mountain retreats", keywords: "mountain hill valley snow himalayas" },
  { label: "Heritage & culture", keywords: "heritage temple fort history ancient" },
  { label: "Off the beaten path", keywords: "offbeat hidden remote wilderness adventure" },
  { label: "Tea & coffee trails", keywords: "tea coffee estate plantation hills" },
];

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".0", "")}k`;
  return n.toString();
}

const indiaShowcase = destinations
  .filter((d) => d.regionId === "india" && d.featured)
  .slice(0, 3);

function DestinationPage() {
  const navigate = useNavigate();
  const { patch, createDraft, bookId, saveStatus } = useStudio();
  useDestinationIds();

  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("india");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of destinations) {
      counts[d.regionId] = (counts[d.regionId] || 0) + 1;
    }
    return counts;
  }, []);

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

  const visibleBooks = useMemo(() => getBooksForRegion(activeRegion), [activeRegion]);

  const pick = async (d: CatalogueDestination) => {
    setSelectedSlug(d.slug);
    const { img: _i, searchKeywords: _sk, featured: _f, bookCount: _bc } = d;
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

      {/* 1. Main Heading — Emotional reframe */}
      <section className="container-edit pt-4 pb-10 md:pb-12">
        <h1 className="display text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.08] tracking-tight">
          Your best memories deserve<br />
          <span className="italic font-light">more than a phone gallery.</span>
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed text-base md:text-lg">
          We turn them into a beautiful book you can hold, share, and pass down.
          Choose a destination and we'll craft an album that brings your journey back to life.
          <span className="block mt-3 text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground/50">
            Made in India · Books from ₹1,499
          </span>
        </p>
      </section>

      {/* 2. Trust Bar — Social proof */}
      <div className="container-edit pb-8 md:pb-10">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground/60">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-foreground/30" />
            10,000+ books delivered across India
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-foreground/30" />
            Free shipping across India
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-foreground/30" />
            Printed in India · Hand-inspected
          </span>
        </div>
      </div>

      {/* 3. India Collection Showcase */}
      <section className="container-edit pb-10 md:pb-14">
        <div className="bg-beige/60 rounded-xl p-6 md:p-10 lg:p-12">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-8">
            <div className="flex-1">
              <p className="text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground/60 mb-3 font-sans">
                Curated collection
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.08] tracking-tight">
                The India Collection
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-lg leading-relaxed">
                Thirty handpicked destinations across India — from the snow peaks of Ladakh
                to the coconut shores of Kerala. Each destination has its own handcrafted book design.
                <span className="block mt-2 text-foreground/40 text-[0.55rem] uppercase tracking-[0.25em]">
                  Books from ₹1,499
                </span>
              </p>
            </div>
            <div className="shrink-0">
              <div className="flex -space-x-2">
                {indiaShowcase.map((d) => (
                  <div
                    key={d.slug}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-background book-shadow"
                  >
                    <img src={d.img} alt={d.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {indiaShowcase.map((d) => (
              <button
                key={d.slug}
                onClick={() => pick(d)}
                className="group relative text-left overflow-hidden rounded-lg book-shadow"
              >
                <div className="aspect-[3/2] img-zoom">
                  <img
                    src={d.img}
                    alt={d.name}
                    loading="lazy"
                    width={800}
                    height={533}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-background">
                    <p className="text-[0.5rem] uppercase tracking-[0.22em] text-background/60 font-sans">
                      {d.country}
                    </p>
                    <h3 className="font-serif text-xl md:text-2xl mt-0.5 leading-tight tracking-tight">
                      {d.name}
                    </h3>
                    <p className="italic text-background/70 text-xs md:text-sm mt-1 font-sans font-light">
                      {d.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Search — welcoming discovery */}
      <section className="container-edit pb-6 md:pb-8">
        <div className="max-w-xl mx-auto">
          <div className="relative group">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none transition-colors duration-300 group-focus-within:text-muted-foreground"
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
              placeholder="Where did your journey take you?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-transparent border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/35 outline-none focus:border-foreground/30 transition-all duration-300"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-muted-foreground/40 hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
            )}
          </div>
          {!query && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground/40 mr-1 font-sans">
                Explore:
              </span>
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setQuery(s.keywords)}
                  className="px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.18em] rounded-full border border-border/60 text-muted-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all duration-200 font-sans"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Region Navigation */}
      <div className="container-edit pb-8 md:pb-12">
        <nav className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
          {REGIONS.map((region) => {
            const count = regionCounts[region.id] || 0;
            const hasDestinations = count > 0;
            const isActive = activeRegion === region.id;
            return (
              <button
                key={region.id}
                onClick={() => {
                  setActiveRegion(region.id);
                  setSelectedSlug(null);
                }}
                disabled={!hasDestinations}
                className={`group relative px-5 py-2 text-[0.7rem] uppercase tracking-[0.2em] rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : hasDestinations
                    ? "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                    : "bg-transparent text-muted-foreground/20 border-border/40 cursor-not-allowed"
                }`}
              >
                <span>{region.label}</span>
                <span
                  className={`ml-1.5 text-[0.55rem] tracking-[0.15em] ${
                    isActive
                      ? "text-background/55"
                      : hasDestinations
                      ? "text-muted-foreground/40 group-hover:text-muted-foreground/60"
                      : "text-muted-foreground/20"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 6. Destination Grid + Cards */}
      <section className="container-edit pb-20 md:pb-32">
        {filteredDestinations.length > 0 ? (
          <>
            {!query && activeRegion && (
              <p className="text-[0.6rem] text-muted-foreground/50 uppercase tracking-[0.25em] mb-7 md:mb-9 text-center font-sans">
                {filteredDestinations.length} destination
                {filteredDestinations.length !== 1 ? "s" : ""} in{" "}
                {REGIONS.find((r) => r.id === activeRegion)?.label}
                {activeRegion === "india" && (
                  <span className="text-foreground/30 ml-2">· India Collection</span>
                )}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {filteredDestinations.map((d) => {
                const isSelected = selectedSlug === d.slug;
                return (
                  <button
                    key={d.slug}
                    onClick={() => pick(d)}
                    className={`group relative text-left w-full transition-all duration-500 ${
                      isSelected ? "opacity-90" : ""
                    }`}
                  >
                    <div
                      className={`img-zoom relative aspect-[4/5] overflow-hidden book-shadow rounded-sm transition-shadow duration-500 ${
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
                      {/* Top vignette */}
                      <div className="absolute inset-0 bg-gradient-to-b from-ink/15 via-transparent to-transparent pointer-events-none" />
                      {/* Bottom editorial gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent/20 to-ink/75 pointer-events-none" />
                      {/* Card content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-8 text-background transition-all duration-300">
                        <p className="text-[0.55rem] uppercase tracking-[0.22em] text-background/60 font-sans font-normal">
                          {d.country}
                        </p>
                        <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl mt-1 leading-[1.08] tracking-tight text-background">
                          {d.name}
                        </h3>
                        <p className="italic text-background/75 mt-1.5 text-sm md:text-base leading-snug font-sans font-light">
                          {d.subtitle}
                        </p>
                        <p className="text-[0.5rem] uppercase tracking-[0.2em] text-background/50 mt-3 font-sans">
                          {formatCount(d.bookCount)} books created
                        </p>
                        {/* CTA on hover */}
                        <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                          <span className="text-[0.5rem] uppercase tracking-[0.2em] font-sans font-medium text-background/90">
                            Create your book
                          </span>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-background/70">
                            <path d="M2 5h6M5 2l3 3-3 3" />
                          </svg>
                        </div>
                      </div>
                      {/* Hover: add circle */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-background/40 bg-background/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
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
                      {/* Selected: checkmark */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-foreground flex items-center justify-center animate-in fade-in zoom-in duration-200">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-background"
                          >
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-border/50 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="text-muted-foreground/50"
              >
                <circle cx="8" cy="8" r="6" />
                <path d="M12.5 12.5l4 4" />
              </svg>
            </div>
            <p className="text-muted-foreground italic text-base">
              {query
                ? `No destinations match "${query}".`
                : "This chapter is still being written."}
            </p>
            <p className="text-muted-foreground/50 text-sm mt-2 leading-relaxed">
              {query
                ? "Try a different search or browse all regions above."
                : "New destinations are added each season."}
            </p>
          </div>
        )}
      </section>

      {/* 7. Inspiration Section — Dynamic & region-aware */}
      <section className="bg-beige/40 py-20 md:py-28">
        <div className="container-edit">
          <p className="eyebrow text-center">From the studio</p>
          <h2 className="display text-3xl md:text-5xl text-center mt-4 max-w-2xl mx-auto leading-[1.1]">
            Books created for<br />
            <span className="italic">
              {REGIONS.find((r) => r.id === activeRegion)?.label ?? "our destinations"}
            </span>
          </h2>
          <p className="text-center text-muted-foreground text-sm mt-4 max-w-lg mx-auto leading-relaxed">
            Real books made by our community. Each one tells a different story.
          </p>
          {visibleBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
              {visibleBooks.slice(0, 3).map((book) => (
                <div key={book.id} className="group cursor-default">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm book-shadow">
                    <img
                      src={book.img}
                      alt={book.title}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 space-y-1.5">
                    <p className="text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground/60 font-sans">
                      {book.location}
                    </p>
                    <h3 className="font-serif text-xl leading-snug tracking-tight text-foreground">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground/70 italic font-sans">
                      by {book.author}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2.5 font-sans font-light">
                      {book.description}
                    </p>
                    <p className="text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground/40 pt-1 font-sans">
                      {book.copies} copies in print
                    </p>
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <p className="text-xs text-muted-foreground/60 italic leading-relaxed">
                        &ldquo;{book.review}&rdquo;
                      </p>
                      <p className="text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground/40 mt-1 font-sans">
                        &mdash; {book.reviewer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground/50 text-sm mt-14 italic">
              No books yet for this region. Be the first.
            </p>
          )}
        </div>
      </section>

      {/* 8. How It Works */}
      <section className="py-20 md:py-28 border-t border-border/40">
        <div className="container-edit">
          <p className="eyebrow text-center">The process</p>
          <h2 className="display text-3xl md:text-5xl text-center mt-4 max-w-2xl mx-auto leading-[1.1]">
            Your book in<br />
            <span className="italic">three simple steps</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-14 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Choose a destination", desc: "Select the place that holds your memories. Each destination has its own handcrafted book design, inspired by the spirit of the land." },
              { step: "02", title: "Upload your photos", desc: "Add your favourite images, arrange them freely, and add captions. Our editor is intuitive, beautiful, and completely flexible." },
              { step: "03", title: "We craft your book", desc: "Premium paper, hand-inspected quality, and printed in India. Delivered to your doorstep in 5–7 business days." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center mx-auto mb-5">
                  <span className="font-serif italic text-lg text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="font-serif text-xl tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto font-sans font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Trust & Payment Footer */}
      <section className="border-t border-border/40 py-10 md:py-12">
        <div className="container-edit">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[0.55rem] uppercase tracking-[0.22em] text-muted-foreground/50 font-sans">
            <span className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2 4-4"/></svg>
              Made in India
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2 4-4"/></svg>
              Love it or we'll fix it
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2 4-4"/></svg>
              Secure checkout · UPI · Cards · Net Banking
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2 4-4"/></svg>
              Free shipping across India
            </span>
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
