import iceland from "@/assets/book-iceland.jpg";
import kyoto from "@/assets/book-kyoto.jpg";
import morocco from "@/assets/book-morocco.jpg";

const editions = [
  {
    no: "N° 01",
    title: "Iceland",
    sub: "Of fire, fog and silence.",
    img: iceland,
    meta: "240 pp · Linen bound",
  },
  {
    no: "N° 02",
    title: "Kyoto",
    sub: "A study in stillness.",
    img: kyoto,
    meta: "208 pp · Charcoal linen",
  },
  {
    no: "N° 03",
    title: "Morocco",
    sub: "Light, clay and shadow.",
    img: morocco,
    meta: "256 pp · Sand linen",
  },
];

export function FeaturedCollection() {
  return (
    <section id="collections" className="bg-background py-28 md:py-40">
      <div className="container-edit">
        <div className="grid md:grid-cols-12 gap-10 items-end mb-20">
          <div className="md:col-span-7">
            <p className="eyebrow">The Collection</p>
            <h2 className="display mt-6 text-5xl md:text-7xl lg:text-[5.5rem]">
              Editions, not<br />products.
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 text-muted-foreground text-[15px] leading-relaxed">
            Each book is a singular object — designed around one destination,
            printed in limited runs, and finished by hand. No two are identical.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20">
          {editions.map((e, i) => (
            <article key={e.title} className={`group ${i === 1 ? "md:mt-24" : ""} ${i === 2 ? "md:mt-12" : ""}`}>
              <div className="img-zoom bg-stone-warm aspect-[4/5] book-shadow">
                <img
                  src={e.img}
                  alt={`${e.title} edition cover`}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-8 flex items-baseline justify-between border-b border-border pb-4">
                <span className="eyebrow">{e.no}</span>
                <span className="eyebrow">{e.meta}</span>
              </div>
              <h3 className="mt-6 font-serif text-4xl">{e.title}</h3>
              <p className="mt-2 italic text-muted-foreground">{e.sub}</p>
              <a href="#" className="btn-ghost mt-6">View edition →</a>
            </article>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
          <a href="#" className="btn-ghost">All destinations</a>
        </div>
      </div>
    </section>
  );
}
