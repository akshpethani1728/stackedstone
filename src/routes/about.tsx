import { createFileRoute, Link } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import hero from "@/assets/hero.jpg";
import craft from "@/assets/craft-paper.jpg";
import shelf1 from "@/assets/shelf-1.jpg";
import bookOpen from "@/assets/book-open.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Stacked Stone" },
      { name: "description", content: "Why Stacked Stone exists — a small studio publishing travel books for the people who lived them." },
      { property: "og:title", content: "About — Stacked Stone" },
      { property: "og:description", content: "A small studio publishing travel books." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="container-edit pt-40 md:pt-48 pb-20 md:pb-28">
        <p className="eyebrow reveal">About</p>
        <h1 className="display mt-8 text-6xl md:text-8xl lg:text-[8rem] max-w-5xl reveal delay-1">
          We make slow books<br />for fast <span className="italic">lives.</span>
        </h1>
      </section>

      <section className="container-edit pb-28">
        <div className="img-zoom aspect-[21/9] overflow-hidden book-shadow">
          <img src={hero} alt="A quiet morning, somewhere far away." className="h-full w-full object-cover kenburns" />
        </div>
      </section>

      <section className="container-edit py-20 md:py-32">
        <div className="grid md:grid-cols-12 gap-10">
          <p className="md:col-span-3 eyebrow">A note</p>
          <div className="md:col-span-8 space-y-8 font-serif text-3xl md:text-4xl leading-snug">
            <p>We started Stacked Stone because the most beautiful trips were ending up in the camera roll.</p>
            <p className="italic opacity-80">Buried under screenshots. Lost to a new phone.</p>
            <p>So we built a small studio that turns those photographs into books — slow, archival, intended for the room you actually live in.</p>
          </div>
        </div>
      </section>

      <section className="bg-sand py-28 md:py-40">
        <div className="container-edit grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 img-zoom aspect-[4/5] overflow-hidden book-shadow">
            <img src={craft} alt="Paper, by hand." className="h-full w-full object-cover" />
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="eyebrow">Materials</p>
            <h2 className="display mt-6 text-5xl md:text-6xl">
              Paper that<br /><span className="italic">remembers.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Munken Pure, uncoated, 150gsm. Smyth-sewn signatures, linen-wrapped boards,
              foil-stamped spines. Each volume is printed in Florence and bound by hand.
            </p>
          </div>
        </div>
      </section>

      <section className="container-edit py-28 md:py-40">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5">
            <p className="eyebrow">The room</p>
            <h2 className="display mt-6 text-5xl md:text-6xl">
              A book is also<br /><span className="italic">furniture.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Every edition is designed to sit on a coffee table for a decade.
              The spine speaks. The cloth softens. The paper opens flat.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7 img-zoom aspect-[4/3] overflow-hidden book-shadow">
            <img src={shelf1} alt="A coffee table, with books." className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-ink text-background py-32 md:py-48">
        <div className="container-edit text-center">
          <p className="eyebrow !text-background/70">Studio</p>
          <h2 className="display mt-6 text-5xl md:text-7xl max-w-3xl mx-auto">
            A small team, in<br /><span className="italic">Mumbai & Florence.</span>
          </h2>
          <p className="mt-10 max-w-xl mx-auto text-background/75 leading-relaxed">
            Six people. Two cities. One bindery we have used for nine years.
            We publish slowly because that's the only way we know how.
          </p>
        </div>
      </section>

      <section className="container-edit py-32 md:py-48 grid md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-6 img-zoom aspect-[4/5] overflow-hidden book-shadow">
          <img src={bookOpen} alt="An open book." className="h-full w-full object-cover" />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <h2 className="display text-5xl md:text-6xl">
            Begin a book<br /><span className="italic">of your own.</span>
          </h2>
          <Link to="/create" className="btn-primary mt-10">Start commissioning</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
