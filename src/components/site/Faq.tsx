import { useState } from "react";

const faqs = [
  { q: "How many photographs do I need?", a: "Between 60 and 220 images works best. Our editors will sequence and curate them — you do not need to pre-select." },
  { q: "What sizes are available?", a: "Three formats: Petit (22×28cm), Standard (27×34cm), and Grand Folio (32×40cm). All in landscape or portrait." },
  { q: "How long does it take?", a: "Six to eight weeks from upload to doorstep. Each book is produced individually." },
  { q: "Can I gift a book?", a: "Yes. Gift orders ship in a linen slipcase with a hand-written letterpressed card." },
  { q: "Do you ship internationally?", a: "We ship worldwide via insured carbon-neutral courier, with duties pre-paid in most regions." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-beige py-28 md:py-40">
      <div className="container-edit grid md:grid-cols-12 gap-16">
        <div className="md:col-span-4">
          <p className="eyebrow">Questions</p>
          <h2 className="display mt-6 text-5xl md:text-6xl">
            Quietly<br /><span className="italic">answered.</span>
          </h2>
        </div>

        <div className="md:col-span-7 md:col-start-6 border-t border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-border">
                <button
                  className="w-full flex items-baseline justify-between gap-8 py-7 text-left group"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-serif text-2xl md:text-3xl group-hover:text-olive transition-colors">
                    {f.q}
                  </span>
                  <span className={`font-serif text-3xl text-olive transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
