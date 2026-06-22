import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { destinations } from "@/lib/destinations";
import shelf1 from "@/assets/shelf-1.jpg";
import shelf2 from "@/assets/shelf-2.jpg";
import bookOpen from "@/assets/book-open.jpg";
import bookStack from "@/assets/book-stack.jpg";
import craft from "@/assets/craft-paper.jpg";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Stacked Stone" },
      { name: "description", content: "A quiet atlas of places, books and rooms — curated travel inspiration from the Stacked Stone studio." },
      { property: "og:title", content: "Explore — Stacked Stone" },
      { property: "og:description", content: "A quiet atlas of places, books and rooms." },
    ],
  }),
  component: ExplorePage,
});

const filters = ["All", "Coastline", "Mountains", "Cities", "Deserts", "Backwaters", "Atlantic"] as const;

const editorial = [
  { eyebrow: "Field Notes", title: "Three mornings in Kyoto.", img: bookOpen, span: "md:col-span-7", ratio: "aspect-[16/10]" },
  { eyebrow: "On the Shelf", title: "Rooms that read.", img: shelf1, span: "md:col-span-5", ratio: "aspect-[4/5]" },
  { eyebrow: "Couples", title: "A honeymoon, bound.", img: shelf2, span: "md:col-span-5", ratio: "aspect-[3/4]" },
  { eyebrow: "Craft", title: "Paper, by hand.", img: craft, span: "md:col-span-7", ratio: "aspect-[16/10]" },
  { eyebrow: "Weekend Escapes", title: "Two nights, one book.", img: bookStack, span: "md:col-span-12", ratio: "aspect-[21/9]" },
];

function ExplorePage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const visible = filter === "All" ? destinations : destinations.filter((d) => d.category === filter);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="container-edit pt-40 md:pt-48 pb-20">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow reveal">Explore</p>
            <h1 className="display mt-6 text-6xl md:text-8xl lg:text-[7rem] reveal delay-1">
              An atlas for<br /><span className="italic">the curious.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground leading-relaxed reveal delay-2">
            A quiet room of destinations, journals and shelf inspiration. Wander freely.
            New chapters are added each season.
          </p>
        </div>
      </section>

      {/* Filter rail */}
      <section className="container-edit pb-10">
        <div className="rule mb-6" />
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`eyebrow transition-colors ${
                filter === f ? "!text-foreground" : "hover:!text-foreground"
              }`}
            >
              {f}
              {filter === f && <span className="ml-2 inline-block h-px w-6 align-middle bg-foreground" />}
            </button>
          ))}
        </div>
        <div className="rule mt-6" />
      </section>

      {/* Destinations masonry */}
      <section className="container-edit pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {visible.map((d, i) => {
            const spans = [
              "md:col-span-7 aspect-[16/10]",
              "md:col-span-5 aspect-[4/5]",
              "md:col-span-5 aspect-[4/5]",
              "md:col-span-7 aspect-[16/10]",
              "md:col-span-6 aspect-[4/3]",
              "md:col-span-6 aspect-[4/3]",
            ];
            const cls = spans[i % spans.length];
            return (
              <Link
                key={d.slug}
                to="/destinations/$slug"
                params={{ slug: d.slug }}
                className={`group relative col-span-1 ${cls.split(" ")[0]} ${i % 4 === 1 ? "md:mt-16" : i % 4 === 3 ? "md:mt-24" : ""}`}
              >
                <div className={`img-zoom relative ${cls.split(" ")[1]} overflow-hidden book-shadow`}>
                  <img
                    src={d.cover}
                    alt={`${d.name} — ${d.tagline}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/55" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-background">
                    <p className="eyebrow !text-background/75">{d.region}</p>
                    <h3 className="font-serif text-4xl md:text-6xl mt-3 tracking-tight">{d.name}</h3>
                    <p className="italic text-background/85 mt-2 text-lg">{d.tagline}</p>
                  </div>
                </div>
                <p className="mt-4 eyebrow text-muted-foreground">{d.category} · {d.season}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Editorial stories */}
      <section className="bg-sand py-28 md:py-40">
        <div className="container-edit">
          <div className="grid md:grid-cols-12 gap-10 mb-16 items-end">
            <div className="md:col-span-7">
              <p className="eyebrow">Journal</p>
              <h2 className="display mt-6 text-5xl md:text-7xl">
                Stories from<br /><span className="italic">the studio.</span>
              </h2>
            </div>
            <p className="md:col-span-4 md:col-start-9 text-muted-foreground leading-relaxed">
              Field notes, paper tests, and conversations with the people who help us
              shape each edition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
            {editorial.map((e, i) => (
              <a
                key={e.title}
                href="#"
                className={`group col-span-1 ${e.span} ${i % 3 === 1 ? "md:mt-16" : ""}`}
              >
                <div className={`img-zoom ${e.ratio} overflow-hidden book-shadow`}>
                  <img src={e.img} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="mt-6">
                  <p className="eyebrow">{e.eyebrow}</p>
                  <h3 className="font-serif text-3xl md:text-4xl mt-2 group-hover:italic transition-all">
                    {e.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-edit py-32 md:py-48 text-center">
        <p className="eyebrow">Begin</p>
        <h2 className="display mt-6 text-5xl md:text-7xl">
          Your own chapter,<br /><span className="italic">awaits.</span>
        </h2>
        <Link to="/create" className="btn-primary mt-12">Start a book</Link>
      </section>

      <Footer />
    </main>
  );
}
