import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { editions, useStudio } from "@/lib/studio-store";
import bookIceland from "@/assets/book-iceland.jpg";
import bookKyoto from "@/assets/book-kyoto.jpg";
import bookMorocco from "@/assets/book-morocco.jpg";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Choose your edition — Stacked Stone" },
      { name: "description", content: "Begin your book. Three editions, handcrafted for the shelf." },
    ],
  }),
  component: CreatePage,
});

const covers = [bookIceland, bookKyoto, bookMorocco];

function CreatePage() {
  const navigate = useNavigate();
  const { patch } = useStudio();

  return (
    <StudioShell current="/create">
      <section className="container-edit pt-24 md:pt-32 pb-20">
        <p className="eyebrow reveal">Step One · The Edition</p>
        <h1 className="display reveal delay-1 mt-6 text-5xl md:text-7xl lg:text-[5.5rem] max-w-3xl">
          Choose the<br /><span className="italic">volume</span> that holds your story.
        </h1>
        <p className="reveal delay-2 mt-8 max-w-md text-muted-foreground leading-relaxed">
          Every edition is made in our Florence bindery — same paper, same craft.
          Only the proportions, the page count, and the weight of the shelf change.
        </p>
      </section>

      <section className="container-edit pb-32 md:pb-48">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-24">
          {editions.map((e, i) => (
            <button
              key={e.slug}
              onClick={() => {
                patch({ edition: e });
                navigate({ to: "/destination" });
              }}
              className={`group text-left reveal delay-${(i % 4) + 1} ${i === 1 ? "md:mt-20" : ""} ${i === 2 ? "md:mt-10" : ""}`}
            >
              <div className="img-zoom aspect-[4/5] book-shadow bg-stone-warm relative">
                <img
                  src={covers[i]}
                  alt={e.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-background mix-blend-difference">
                  <span className="font-serif italic text-2xl">N° 0{i + 1}</span>
                  <span className="eyebrow !text-background/90">{e.pages}</span>
                </div>
              </div>
              <div className="mt-10 flex items-baseline justify-between border-b border-border pb-4">
                <span className="eyebrow">{e.size}</span>
                <span className="eyebrow">from ${e.price}</span>
              </div>
              <h3 className="mt-6 font-serif text-4xl tracking-tight">{e.name}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-sm">{e.description}</p>
              <span className="btn-ghost mt-8 inline-flex">Select edition →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-beige/40">
        <div className="container-edit py-20 grid md:grid-cols-12 gap-10 items-end">
          <p className="md:col-span-7 font-serif text-3xl md:text-4xl italic leading-snug">
            "I'm still surprised at how much the book weighs. It feels like a record of a year, not a phone gallery."
          </p>
          <p className="md:col-span-4 md:col-start-9 eyebrow">— Aanya R., Collector Edition</p>
        </div>
      </section>
    </StudioShell>
  );
}
