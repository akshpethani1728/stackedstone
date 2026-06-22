import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountShell } from "@/components/studio/AccountShell";
import kerala from "@/assets/dest-kerala.jpg";
import ladakh from "@/assets/dest-ladakh.jpg";

export const Route = createFileRoute("/account/drafts")({
  head: () => ({ meta: [{ title: "Drafts — Stacked Stone" }, { name: "robots", content: "noindex" }] }),
  component: DraftsPage,
});

const drafts = [
  { title: "Kerala, slow water", img: kerala, photos: 38, edition: "Journey Edition", updated: "Edited 2 days ago" },
  { title: "Ladakh, untitled", img: ladakh, photos: 12, edition: "Weekend Edition", updated: "Edited last week" },
];

function DraftsPage() {
  return (
    <AccountShell>
      <section className="container-edit pt-20 md:pt-28 pb-12">
        <p className="eyebrow">Drafts</p>
        <h1 className="display mt-6 text-5xl md:text-7xl">On the <span className="italic">desk.</span></h1>
      </section>
      <section className="container-edit pb-32 space-y-16">
        {drafts.map((d, i) => (
          <article key={d.title} className="grid md:grid-cols-12 gap-10 items-center border-b border-border pb-16">
            <div className={`md:col-span-5 ${i % 2 ? "md:order-2" : ""}`}>
              <div className="img-zoom aspect-[4/3] book-shadow">
                <img src={d.img} alt={d.title} loading="lazy" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:col-span-6">
              <p className="eyebrow">{d.edition}</p>
              <h2 className="font-serif text-4xl md:text-5xl italic mt-4">{d.title}</h2>
              <p className="mt-4 text-muted-foreground">{d.photos} photographs · {d.updated}</p>
              <div className="mt-10 flex items-center gap-8">
                <Link to="/upload" className="btn-primary">Continue editing</Link>
                <button className="btn-ghost text-muted-foreground">Discard</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </AccountShell>
  );
}
