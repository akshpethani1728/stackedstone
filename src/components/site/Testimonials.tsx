import portrait from "@/assets/testimonial-1.jpg";

export function Testimonials() {
  return (
    <section className="bg-background py-28 md:py-40">
      <div className="container-edit grid md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-5 img-zoom aspect-[4/5] book-shadow">
          <img src={portrait} alt="Reader with book" loading="lazy" width={1000} height={1200} className="h-full w-full object-cover" />
        </div>

        <figure className="md:col-span-6 md:col-start-7">
          <p className="eyebrow">A Note from a Reader</p>
          <blockquote className="mt-8 font-serif text-3xl md:text-5xl leading-[1.15] tracking-tight">
            <span className="text-olive italic">“</span>
            It does not feel like a product. It feels like
            <span className="italic"> something my grandmother might have kept</span>,
            and like something my daughter will inherit.
            <span className="text-olive italic">”</span>
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-6 border-t border-border pt-6">
            <div>
              <div className="font-serif text-lg">Aanya Mehta</div>
              <div className="eyebrow mt-1">Volume 02 · Kyoto</div>
            </div>
          </figcaption>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
            {[
              ["12,400", "Books bound"],
              ["46", "Destinations"],
              ["4.97", "Average rating"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-4xl">{n}</div>
                <div className="eyebrow mt-2">{l}</div>
              </div>
            ))}
          </div>
        </figure>
      </div>
    </section>
  );
}
