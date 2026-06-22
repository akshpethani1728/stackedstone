import shelf1 from "@/assets/shelf-1.jpg";
import shelf2 from "@/assets/shelf-2.jpg";

export function ShelfInspiration() {
  return (
    <section className="bg-sand py-28 md:py-40">
      <div className="container-edit">
        <div className="grid md:grid-cols-12 gap-10 mb-20 items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">On the Shelf</p>
            <h2 className="display mt-6 text-5xl md:text-7xl">
              A book that earns<br /><span className="italic">its place.</span>
            </h2>
          </div>
          <p className="md:col-span-4 md:col-start-9 text-muted-foreground leading-relaxed">
            Stacked Stone books are designed first for the room they live in.
            They sit beside the coffee, the candle, the bowl — and quietly hold
            the memory of somewhere far away.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 md:gap-10">
          <div className="md:col-span-7 img-zoom aspect-[4/3] book-shadow">
            <img src={shelf1} alt="Coffee table with stacked books" loading="lazy" width={1600} height={1200} className="h-full w-full object-cover" />
          </div>
          <div className="md:col-span-5 md:mt-24 img-zoom aspect-[3/4] book-shadow">
            <img src={shelf2} alt="Oak bookshelf with curated books" loading="lazy" width={1200} height={1500} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
