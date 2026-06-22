import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked — Stacked Stone" },
      { name: "description", content: "Quiet answers about ordering, printing, shipping and care of your Stacked Stone book." },
      { property: "og:title", content: "Frequently Asked — Stacked Stone" },
      { property: "og:description", content: "Quietly answered." },
    ],
  }),
  component: FaqPage,
});

const groups = [
  {
    title: "The Book",
    items: [
      { q: "How many photographs do I need?", a: "Between 60 and 220 images works best. Our editors will sequence and curate — you do not need to pre-select." },
      { q: "What sizes are available?", a: "Three formats: Petit (22×28 cm), Standard (27×34 cm), Grand Folio (32×40 cm). Landscape or portrait." },
      { q: "Can I add captions?", a: "Yes — short captions, foreword pages, and a colophon are all options. We keep typography quiet and consistent." },
    ],
  },
  {
    title: "The Process",
    items: [
      { q: "How long does it take?", a: "Six to eight weeks from upload to doorstep. Each book is produced individually." },
      { q: "Will I see a proof?", a: "You will receive a complete digital proof. Once you approve, we print." },
      { q: "Can I edit later?", a: "Drafts can be revised freely until the moment you commission. After printing begins, edits are not possible." },
    ],
  },
  {
    title: "Shipping & Care",
    items: [
      { q: "Where do you ship?", a: "We ship to every city and town across India via insured, carbon-neutral courier. All taxes and duties are included — no surprises at your door." },
      { q: "How should I care for the book?", a: "Keep it out of direct sun. The linen will soften with handling. Spills wipe off the cover; the paper is uncoated and breathes." },
      { q: "Can I gift a book?", a: "Yes. Gift orders ship in a linen slipcase with a hand-written letterpressed card." },
    ],
  },
];

function FaqPage() {
  const [open, setOpen] = useState<string | null>("0-0");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="container-edit pt-40 md:pt-48 pb-20">
        <p className="eyebrow reveal">Quiet answers</p>
        <h1 className="display mt-6 text-6xl md:text-8xl max-w-4xl reveal delay-1">
          Things you may<br /><span className="italic">wonder about.</span>
        </h1>
      </section>

      {groups.map((g, gi) => (
        <section key={g.title} className="container-edit pb-20">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-3">
              <p className="eyebrow">{String(gi + 1).padStart(2, "0")}</p>
              <h2 className="display mt-4 text-3xl md:text-4xl">{g.title}</h2>
            </div>
            <div className="md:col-span-8 md:col-start-5 border-t border-border">
              {g.items.map((it, i) => {
                const key = `${gi}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={it.q} className="border-b border-border">
                    <button
                      onClick={() => setOpen(isOpen ? null : key)}
                      className="w-full flex items-baseline justify-between gap-8 py-7 text-left group"
                    >
                      <span className="font-serif text-2xl md:text-3xl group-hover:text-olive transition-colors">{it.q}</span>
                      <span className={`font-serif text-3xl text-olive transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}>+</span>
                    </button>
                    <div className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="text-muted-foreground leading-relaxed max-w-lg">{it.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section className="container-edit py-32 md:py-48 text-center">
        <p className="eyebrow">Still curious?</p>
        <h2 className="display mt-6 text-4xl md:text-6xl">
          Write to the studio.<br /><span className="italic">We read every letter.</span>
        </h2>
        <Link to="/contact" className="btn-primary mt-10">Contact us</Link>
      </section>

      <Footer />
    </main>
  );
}
