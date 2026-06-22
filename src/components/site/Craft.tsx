import craft from "@/assets/craft-paper.jpg";

const pillars = [
  { k: "Paper", v: "150gsm uncoated Munken, archival cotton endpapers." },
  { k: "Binding", v: "Smyth-sewn signatures, debossed linen-wrapped board." },
  { k: "Print", v: "Stochastic six-colour offset, calibrated by hand." },
  { k: "Finish", v: "Wrapped in muslin, sealed with letterpressed seal." },
];

export function Craft() {
  return (
    <section id="craft" className="bg-background py-28 md:py-40">
      <div className="container-edit grid md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-6 md:sticky md:top-32">
          <div className="img-zoom aspect-[4/5] book-shadow">
            <img
              src={craft}
              alt="Close-up of deckled book paper edge"
              loading="lazy"
              width={1400}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-6">
          <p className="eyebrow">The Craft</p>
          <h2 className="display mt-6 text-5xl md:text-7xl">
            Made the slow way,<br /><span className="italic">on purpose.</span>
          </h2>
          <p className="mt-8 text-muted-foreground leading-relaxed max-w-lg">
            Every Stacked Stone book is produced in small batches by a single bindery
            in Florence. The paper is chosen for its hand. The cloth is dyed in the
            shade. The press runs at half speed.
          </p>

          <div className="mt-14 border-t border-border">
            {pillars.map((p) => (
              <div key={p.k} className="grid grid-cols-12 gap-6 py-7 border-b border-border">
                <div className="col-span-4 md:col-span-3">
                  <span className="eyebrow">{p.k}</span>
                </div>
                <div className="col-span-8 md:col-span-9 font-serif text-xl leading-snug">
                  {p.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
