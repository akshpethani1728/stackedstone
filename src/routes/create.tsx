import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import { editions } from "@/data";
import { useStudio } from "@/stores/studio";
import { useEditionIds } from "@/hooks/use-catalogue-ids";
import bookIceland from "@/assets/book-iceland.jpg";
import bookKyoto from "@/assets/book-kyoto.jpg";
import bookMorocco from "@/assets/book-morocco.jpg";
import bookStack from "@/assets/book-stack.jpg";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Choose your edition — Stacked Stone" },
      { name: "description", content: "Four editions, handcrafted for the shelf." },
    ],
  }),
  component: CreatePage,
});

const covers = [bookIceland, bookKyoto, bookMorocco, bookStack];

function CreatePage() {
  const navigate = useNavigate();
  const { state, patch, saveStatus } = useStudio();
  const editionIds = useEditionIds();

  return (
    <StudioShell current="/create">
      <SaveIndicator status={saveStatus} />
      <section className="container-edit pt-24 md:pt-32 pb-20">
        <p className="eyebrow reveal">Step Two · The Edition</p>
        <h1 className="display reveal delay-1 mt-6 text-5xl md:text-7xl lg:text-[5.5rem] max-w-3xl">
          Choose the<br /><span className="italic">volume</span> that holds your story.
        </h1>
        <p className="reveal delay-2 mt-8 max-w-md text-muted-foreground leading-relaxed">
          Every edition is made in our Jaipur bindery — same paper, same craft. Only the proportions
          and the weight of the shelf change.
          {state.destination && (
            <span className="block mt-3 eyebrow !text-foreground">For {state.destination.name}</span>
          )}
        </p>
        {!state.destination && (
          <Link to="/destination" className="btn-ghost mt-6 inline-flex text-muted-foreground">← Choose a destination first</Link>
        )}
      </section>

      <section className="container-edit pb-32 md:pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {editions.map((e, i) => (
            <button
              key={e.slug}
              onClick={() => {
                patch({ edition: e });
                navigate({ to: "/cover" });
              }}
              className={`group text-left reveal delay-${(i % 4) + 1} ${i % 2 === 1 ? "md:mt-16" : ""}`}
            >
              <div className="img-zoom aspect-[4/5] book-shadow bg-stone-warm relative">
                <img src={covers[i]} alt={e.name} loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-background mix-blend-difference">
                  <span className="font-serif italic text-2xl">N° 0{i + 1}</span>
                  <span className="eyebrow !text-background/90">{e.size}</span>
                </div>
              </div>
              <div className="mt-10 flex items-baseline justify-between border-b border-border pb-4">
                <span className="eyebrow">{e.pages}</span>
                <span className="eyebrow">from ₹{e.price}</span>
              </div>
              <h3 className="mt-6 font-serif text-4xl tracking-tight">{e.name}</h3>
              <p className="mt-3 italic text-foreground/70">{e.ideal}</p>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">{e.description}</p>
              <p className="mt-5 text-sm text-muted-foreground/80">{e.photoEstimate}</p>
              <span className="btn-ghost mt-8 inline-flex">Select edition →</span>
            </button>
          ))}
        </div>
      </section>
    </StudioShell>
  );
}
