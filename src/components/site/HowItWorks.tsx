const steps = [
  {
    n: "01",
    title: "Choose",
    body: "Pick a destination, a format and a cover cloth. Three sizes, six linens, one decision at a time.",
  },
  {
    n: "02",
    title: "Upload",
    body: "Drop in your photographs. Our editors sequence them into a quiet, cinematic narrative — no templates.",
  },
  {
    n: "03",
    title: "Display",
    body: "Your book arrives wrapped in muslin, ready for the table beside the lamp, the bowl, the candle.",
  },
];

export function HowItWorks() {
  return (
    <section id="process" className="bg-beige py-28 md:py-40">
      <div className="container-edit">
        <div className="max-w-2xl mb-24">
          <p className="eyebrow">The Process</p>
          <h2 className="display mt-6 text-5xl md:text-7xl">
            Three steps,<br /><span className="italic">a single object.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-border">
          {steps.map((s) => (
            <div key={s.n} className="bg-beige p-10 md:p-14 min-h-[360px] flex flex-col">
              <div className="flex items-start justify-between">
                <span className="font-serif italic text-2xl text-olive">{s.n}</span>
                <span className="h-px w-16 bg-border mt-4" />
              </div>
              <h3 className="mt-16 font-serif text-5xl md:text-6xl">{s.title}</h3>
              <p className="mt-auto pt-10 text-muted-foreground leading-relaxed max-w-sm">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
