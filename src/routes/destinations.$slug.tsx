import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { destinations, getDestination } from "@/data";

export const Route = createFileRoute("/destinations/$slug")({
  head: ({ params }) => {
    const d = params?.slug ? getDestination(params.slug) : undefined;
    const title = d ? `${d.name} — Stacked Stone` : "Destination — Stacked Stone";
    const desc = d ? `${d.tagline} ${d.mood}` : "A travel destination, bound between covers.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(d ? [{ property: "og:image", content: d.hero }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const d = getDestination(params.slug);
    if (!d) throw notFound();
    return d;
  },
  notFoundComponent: () => (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="display mt-4 text-5xl">This place isn't on our map.</h1>
        <Link to="/explore" className="btn-ghost mt-8 inline-flex">Back to explore</Link>
      </div>
    </main>
  ),
  component: DestinationDetail,
});

function DestinationDetail() {
  const d = Route.useLoaderData() as import("@/lib/destinations").DestinationEntry;
  const related = destinations.filter((x) => d.pairings.includes(x.slug));

  return (
    <main
      className="min-h-screen"
      style={{ background: d.palette.bg, color: d.palette.ink }}
    >
      <Navigation />

      {/* Hero */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
        <img
          src={d.hero}
          alt={d.name}
          className="absolute inset-0 h-full w-full object-cover kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />
        <div className="absolute inset-x-0 bottom-0 container-edit pb-16 md:pb-24 text-background">
          <p className="eyebrow !text-background/80 reveal">{d.country} · {d.region}</p>
          <h1 className="display mt-6 text-7xl md:text-[9rem] leading-[0.9] reveal delay-1">
            {d.name}
          </h1>
          <p className="mt-6 italic text-2xl md:text-3xl max-w-2xl reveal delay-2">{d.tagline}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="container-edit py-28 md:py-40">
        <div className="grid md:grid-cols-12 gap-10">
          <p className="md:col-span-3 eyebrow" style={{ color: d.palette.accent }}>
            A chapter
          </p>
          <p className="md:col-span-8 font-serif text-3xl md:text-5xl leading-snug">
            {d.mood}
          </p>
        </div>
      </section>

      {/* Featured Book */}
      <section className="py-28 md:py-40" style={{ background: `color-mix(in oklab, ${d.palette.bg} 70%, white)` }}>
        <div className="container-edit grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-6 relative">
            <div className="aspect-[3/4] overflow-hidden book-shadow img-zoom">
              <img src={d.cover} alt={`${d.name} edition`} className="h-full w-full object-cover" />
            </div>
            <span className="absolute -top-4 -left-4 eyebrow" style={{ color: d.palette.accent }}>
              Edition № {String(destinations.indexOf(d) + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="eyebrow" style={{ color: d.palette.accent }}>Featured Volume</p>
            <h2 className="display mt-6 text-5xl md:text-6xl">
              The {d.name}<br /><span className="italic">Edition.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed opacity-80">
              Sequenced with our editors, printed on Munken Pure, Smyth-sewn and wrapped in a
              linen slipcase. Yours, in 6–8 weeks.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-6 text-sm">
              <div><dt className="eyebrow" style={{ color: d.palette.accent }}>Season</dt><dd className="mt-2">{d.season}</dd></div>
              <div><dt className="eyebrow" style={{ color: d.palette.accent }}>Mood</dt><dd className="mt-2">{d.category}</dd></div>
              <div><dt className="eyebrow" style={{ color: d.palette.accent }}>Pages</dt><dd className="mt-2">120 – 220</dd></div>
              <div><dt className="eyebrow" style={{ color: d.palette.accent }}>Format</dt><dd className="mt-2">Petit · Standard · Grand</dd></div>
            </dl>
            <Link to="/destination" className="btn-primary mt-12">Commission yours</Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-edit py-28 md:py-40">
        <div className="grid md:grid-cols-12 gap-16">
          {d.story.map((s, i) => (
            <article key={s.title} className={`md:col-span-6 ${i % 2 ? "md:mt-24" : ""}`}>
              <p className="eyebrow" style={{ color: d.palette.accent }}>{s.eyebrow}</p>
              <h3 className="display mt-4 text-4xl md:text-5xl">{s.title}</h3>
              <p className="mt-6 text-lg leading-relaxed opacity-80 max-w-md">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-28 md:py-40" style={{ background: `color-mix(in oklab, ${d.palette.bg} 60%, white)` }}>
        <div className="container-edit">
          <p className="eyebrow text-center" style={{ color: d.palette.accent }}>Image Collection</p>
          <h2 className="display mt-4 text-4xl md:text-6xl text-center">A short look.</h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mt-20">
            {d.gallery.map((src, i) => {
              const layout = [
                "md:col-span-8 aspect-[16/10]",
                "md:col-span-4 aspect-[3/4] md:mt-24",
                "md:col-span-5 aspect-[4/5]",
                "md:col-span-7 aspect-[16/10] md:mt-12",
              ][i % 4];
              return (
                <div key={i} className={`img-zoom overflow-hidden book-shadow col-span-1 ${layout}`}>
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="container-edit py-28 md:py-40">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="eyebrow" style={{ color: d.palette.accent }}>Suggestions</p>
            <h2 className="display mt-4 text-4xl md:text-6xl">Pairs beautifully with.</h2>
          </div>
          <Link to="/explore" className="btn-ghost hidden md:inline-flex">All destinations →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-10">
          {related.map((r) => (
            <Link
              key={r.slug}
              to="/destinations/$slug"
              params={{ slug: r.slug }}
              className="group block"
            >
              <div className="img-zoom aspect-[4/5] overflow-hidden book-shadow">
                <img src={r.cover} alt={r.name} className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-5 font-serif text-3xl">{r.name}</h3>
              <p className="italic opacity-70">{r.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-48 text-center" style={{ background: d.palette.ink, color: d.palette.bg }}>
        <p className="eyebrow" style={{ color: d.palette.accent, opacity: 1 }}>Begin</p>
        <h2 className="display mt-6 text-5xl md:text-7xl">
          Bind your own<br /><span className="italic">{d.name}.</span>
        </h2>
        <Link
          to="/destination"
          className="inline-flex items-center justify-center gap-3 mt-12 px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] border transition-colors"
          style={{ background: d.palette.bg, color: d.palette.ink, borderColor: d.palette.bg }}
        >
          Commission a book
        </Link>
      </section>

      <Footer />
    </main>
  );
}
