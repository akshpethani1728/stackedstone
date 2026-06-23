import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { useStudio } from "@/stores/studio";
import { useDestinationIds } from "@/hooks/use-catalogue-ids";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import type { Destination } from "@/types";
import bali from "@/assets/dest-bali.jpg";
import kashmir from "@/assets/dest-kashmir.jpg";
import goa from "@/assets/dest-goa.jpg";
import rajasthan from "@/assets/dest-rajasthan.jpg";
import kerala from "@/assets/dest-kerala.jpg";
import ladakh from "@/assets/dest-ladakh.jpg";
import iceland from "@/assets/book-iceland.jpg";
import kyoto from "@/assets/book-kyoto.jpg";
import morocco from "@/assets/book-morocco.jpg";

export const Route = createFileRoute("/destination")({
  head: () => ({
    meta: [
      { title: "Choose your destination — Stacked Stone" },
      { name: "description", content: "An atlas of destinations, bound between covers." },
    ],
  }),
  component: DestinationPage,
});

type D = Destination & { img: string; span?: string; ratio?: string };

const destinations: D[] = [
  { slug: "kashmir",   name: "Kashmir",   region: "India · Himalayas",    tagline: "Houseboats and slow water.",       img: kashmir,   span: "md:col-span-7", ratio: "aspect-[16/10]" },
  { slug: "japan",     name: "Japan",     region: "Honshu",               tagline: "A study in stillness.",            img: kyoto,     span: "md:col-span-5", ratio: "aspect-[4/5]" },
  { slug: "goa",       name: "Goa",       region: "Konkan coast",         tagline: "Salt, palms, slow Sundays.",       img: goa,       span: "md:col-span-5", ratio: "aspect-[4/5]" },
  { slug: "rajasthan", name: "Rajasthan", region: "Pink City & beyond",   tagline: "Light through carved sandstone.",  img: rajasthan, span: "md:col-span-7", ratio: "aspect-[16/10]" },
  { slug: "bali",      name: "Bali",      region: "Ubud highlands",       tagline: "Terraces wrapped in fog.",         img: bali,      span: "md:col-span-6", ratio: "aspect-[4/3]" },
  { slug: "kerala",    name: "Kerala",    region: "Backwaters",           tagline: "A morning that lasts all day.",    img: kerala,    span: "md:col-span-6", ratio: "aspect-[4/3]" },
  { slug: "ladakh",    name: "Ladakh",    region: "High Himalaya",        tagline: "Where the road simply stops.",     img: ladakh,    span: "md:col-span-7", ratio: "aspect-[16/10]" },
  { slug: "europe",    name: "Iceland",   region: "North Atlantic",       tagline: "Fog, fjord, fire.",                img: iceland,   span: "md:col-span-5", ratio: "aspect-[4/5]" },
  { slug: "morocco",   name: "Morocco",   region: "Marrakech to Atlas",   tagline: "Clay, shadow, ochre.",             img: morocco,   span: "md:col-span-12", ratio: "aspect-[21/9]" },
];

function DestinationPage() {
  const navigate = useNavigate();
  const { state, patch, createDraft, bookId, saveStatus } = useStudio();
  const destIds = useDestinationIds();

  const pick = async (d: D) => {
    const { img: _i, span: _s, ratio: _r, ...rest } = d;
    patch({ destination: rest, cover: undefined });
    if (!bookId) {
      try {
        await createDraft();
      } catch {
        navigate({ to: "/login", search: { redirect: "/destination" } });
        return;
      }
    }
    navigate({ to: "/create" });
  };

  return (
    <StudioShell current="/destination">
      <SaveIndicator status={saveStatus} />
      <section className="container-edit pt-24 md:pt-32 pb-16">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Step One · The Place</p>
            <h1 className="display mt-6 text-5xl md:text-7xl lg:text-[5.5rem]">
              An atlas, not<br /><span className="italic">a menu.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground leading-relaxed">
            Choose the place you'd like to live with. New destinations are added each season, set in
            conversation with photographers who know the land.
          </p>
        </div>
      </section>

      <section className="container-edit pb-32 md:pb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {destinations.map((d, i) => (
            <button
              key={d.slug}
              onClick={() => pick(d)}
              className={`group relative text-left col-span-1 ${d.span ?? "md:col-span-6"} ${i % 3 === 1 ? "md:mt-12" : ""}`}
            >
              <div className={`img-zoom relative ${d.ratio} overflow-hidden book-shadow`}>
                <img src={d.img} alt={`${d.name} — ${d.tagline}`} loading="lazy" width={1600} height={1200} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/55" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-background">
                  <p className="eyebrow !text-background/75">{d.region}</p>
                  <h3 className="font-serif text-4xl md:text-6xl mt-3 tracking-tight">{d.name}</h3>
                  <p className="italic text-background/85 mt-2 text-lg">{d.tagline}</p>
                </div>
                <span className="absolute top-6 right-6 text-background/80 eyebrow !text-background/75 opacity-0 group-hover:opacity-100 transition-opacity">
                  Select →
                </span>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-24 text-center text-muted-foreground italic">
          More chapters being written — Vietnam, Patagonia, Lisbon, Hokkaido.
        </p>
      </section>
    </StudioShell>
  );
}
