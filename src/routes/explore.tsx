import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { destinations } from "@/data";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Stacked Stone" },
      { name: "description", content: "A visual atlas of Stacked Stone travel books — product close-ups, quiet interiors, and the Indian and world destinations they hold." },
      { property: "og:title", content: "Explore — Stacked Stone" },
      { property: "og:description", content: "A visual atlas of Stacked Stone travel books." },
    ],
  }),
  component: ExplorePage,
});

// Load every new explore image (eager so we can shuffle & tile).
const exploreImages = import.meta.glob("@/assets/explore/*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

type Tile = { src: string; slug: string; group: string };

function buildTiles(): Tile[] {
  return Object.entries(exploreImages).map(([path, src]) => {
    const slug = path.split("/").pop()!.replace(".jpg", "");
    const group =
      slug.startsWith("prod-") ? "Product" :
      slug.startsWith("hand-") ? "Moments" :
      slug.startsWith("int-") ? "Interiors" :
      slug.startsWith("in-") ? "India" :
      slug.startsWith("wo-") ? "World" :
      slug.startsWith("craft-") ? "Craft" : "Studio";
    return { src, slug, group };
  });
}

const chapters: Array<{
  key: string;
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  filter: (t: Tile) => boolean;
}> = [
  {
    key: "product",
    eyebrow: "Chapter One",
    title: "The Object,",
    italic: "in your hands.",
    body: "Linen wraps, embossed serifs, gilded edges. Every book leaves the studio built to sit on a table for a decade — and open again like it's the first time.",
    filter: (t) => t.group === "Product",
  },
  {
    key: "moments",
    eyebrow: "Chapter Two",
    title: "The Quiet",
    italic: "moments it holds.",
    body: "A grandmother's hands on a Kashmir spread. A page turned on a bedside table. The way a memory returns when the paper is thick enough to slow you down.",
    filter: (t) => t.group === "Moments" || t.group === "Interiors",
  },
  {
    key: "india",
    eyebrow: "Chapter Three",
    title: "India,",
    italic: "bound between covers.",
    body: "Shikaras on Dal Lake. Blue rooftops of Jodhpur. A book on a Chettinad tile floor. The country you grew up in, rendered as an object worth keeping.",
    filter: (t) => t.group === "India",
  },
  {
    key: "world",
    eyebrow: "Chapter Four",
    title: "And the world",
    italic: "beyond.",
    body: "Kyoto tatami. Amalfi lemons. A Brooklyn fire escape at dusk. The other places you carry.",
    filter: (t) => t.group === "World" || t.group === "Craft",
  },
];

const spanPatterns = [
  "md:col-span-7 aspect-[16/10]",
  "md:col-span-5 aspect-[4/5]",
  "md:col-span-4 aspect-[3/4]",
  "md:col-span-8 aspect-[16/9]",
  "md:col-span-6 aspect-[4/5]",
  "md:col-span-6 aspect-[4/3]",
  "md:col-span-5 aspect-[3/4]",
  "md:col-span-7 aspect-[16/11]",
  "md:col-span-12 aspect-[21/9]",
  "md:col-span-4 aspect-[4/5]",
  "md:col-span-8 aspect-[16/10]",
  "md:col-span-6 aspect-[1/1]",
];

function ExplorePage() {
  const tiles = useMemo(buildTiles, []);
  const heroTile = tiles[0];
  const marqueeTiles = tiles;
  const [dest, setDest] = useState<string>("All");
  const destFiltered = dest === "All" ? destinations : destinations.filter((d) => d.category === dest);
  const filters = ["All", "Coastline", "Mountains", "Cities", "Deserts", "Backwaters", "Atlantic"] as const;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-40 md:pt-48 pb-24">
        <div className="container-edit grid md:grid-cols-12 gap-10 items-end mb-16">
          <div className="md:col-span-8">
            <p className="eyebrow reveal">Explore · Volume III</p>
            <h1 className="display mt-6 text-6xl md:text-8xl lg:text-[8rem] leading-[0.92] reveal delay-1">
              A visual atlas<br />
              <span className="italic">of the shelf.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground leading-relaxed reveal delay-2">
            Field notes, product close-ups, quiet interiors, and every destination
            our books have been carried to. Wander slowly — this is a magazine, not
            a menu.
          </p>
        </div>

        {heroTile && (
          <div className="container-edit">
            <div className="img-zoom aspect-[21/9] overflow-hidden book-shadow">
              <img src={heroTile.src} alt="A Stacked Stone book" className="h-full w-full object-cover" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="eyebrow">Cover Story · The Oat Linen Edition</p>
              <Link to="/create" className="story-link eyebrow">Commission a volume →</Link>
            </div>
          </div>
        )}
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────── */}
      <section className="border-y border-foreground/10 py-6 overflow-hidden bg-sand">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {[...marqueeTiles, ...marqueeTiles].map((t, i) => (
            <div key={i} className="h-24 w-40 shrink-0 overflow-hidden">
              <img src={t.src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ── CHAPTERS ────────────────────────────────────────── */}
      {chapters.map((chapter, ci) => {
        const chapterTiles = tiles.filter(chapter.filter);
        // If no images in this group yet, still fall back to all tiles so the layout has something.
        const pool = chapterTiles.length > 0 ? chapterTiles : tiles;
        // Build a long tile list by repeating pool until ~14 items.
        const rendered: Tile[] = [];
        let idx = 0;
        while (rendered.length < 14) {
          rendered.push(pool[idx % pool.length]);
          idx++;
        }
        const bg = ci % 2 === 0 ? "bg-background" : "bg-sand";
        return (
          <section key={chapter.key} className={`${bg} py-28 md:py-40`}>
            <div className="container-edit">
              <div className="grid md:grid-cols-12 gap-10 items-end mb-16">
                <div className="md:col-span-7">
                  <p className="eyebrow">{chapter.eyebrow}</p>
                  <h2 className="display mt-6 text-5xl md:text-7xl leading-[0.95]">
                    {chapter.title}<br /><span className="italic">{chapter.italic}</span>
                  </h2>
                </div>
                <p className="md:col-span-4 md:col-start-9 text-muted-foreground leading-relaxed">
                  {chapter.body}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                {rendered.map((t, i) => {
                  const cls = spanPatterns[i % spanPatterns.length];
                  const [col, ratio] = cls.split(" ");
                  const offset = i % 4 === 1 ? "md:mt-16" : i % 4 === 3 ? "md:mt-24" : "";
                  return (
                    <figure key={`${chapter.key}-${i}`} className={`group col-span-1 ${col} ${offset}`}>
                      <div className={`img-zoom overflow-hidden book-shadow ${ratio}`}>
                        <img
                          src={t.src}
                          alt={t.slug.replace(/-/g, " ")}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {i % 5 === 0 && (
                        <figcaption className="mt-4 eyebrow text-muted-foreground">
                          Plate {String(ci * 14 + i + 1).padStart(3, "0")} · {chapter.key}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── PULL QUOTE ──────────────────────────────────────── */}
      <section className="container-edit py-32 md:py-48 text-center">
        <p className="eyebrow">A Note From the Studio</p>
        <p className="font-serif italic text-3xl md:text-5xl leading-tight max-w-4xl mx-auto mt-8">
          "We don't make books to be read once. We make them to sit on a table,
          catch the afternoon light, and quietly wait for you to remember."
        </p>
        <p className="eyebrow mt-8">— The Bindery, Jaipur</p>
      </section>

      {/* ── DESTINATIONS INDEX ──────────────────────────────── */}
      <section className="bg-ink text-background py-28 md:py-40">
        <div className="container-edit">
          <div className="grid md:grid-cols-12 gap-10 items-end mb-14">
            <div className="md:col-span-8">
              <p className="eyebrow !text-background/60">The Atlas</p>
              <h2 className="display mt-6 text-5xl md:text-7xl">
                Every destination,<br /><span className="italic">catalogued.</span>
              </h2>
            </div>
            <p className="md:col-span-4 text-background/70 leading-relaxed">
              Over a hundred places, arranged by mood. Choose a category and
              wander — each opens into its own edition.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-background/15 py-5 mb-12">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setDest(f)}
                className={`eyebrow transition-colors ${dest === f ? "!text-background" : "!text-background/50 hover:!text-background"}`}
              >
                {f}
                {dest === f && <span className="ml-2 inline-block h-px w-6 align-middle bg-background" />}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {destFiltered.slice(0, 24).map((d) => (
              <Link
                key={d.slug}
                to="/destinations/$slug"
                params={{ slug: d.slug }}
                className="group"
              >
                <div className="img-zoom aspect-[3/4] overflow-hidden">
                  <img src={d.cover} alt={d.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 font-serif text-xl">{d.name}</p>
                <p className="eyebrow !text-background/50 mt-1">{d.region}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="container-edit py-32 md:py-48 text-center">
        <p className="eyebrow">Your Volume</p>
        <h2 className="display mt-6 text-5xl md:text-7xl">
          Begin the<br /><span className="italic">next chapter.</span>
        </h2>
        <Link to="/create" className="btn-primary mt-12 inline-block">Start a book</Link>
      </section>

      <Footer />
    </main>
  );
}
