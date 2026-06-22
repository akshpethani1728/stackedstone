import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountShell } from "@/components/studio/AccountShell";
import iceland from "@/assets/book-iceland.jpg";
import kyoto from "@/assets/book-kyoto.jpg";
import morocco from "@/assets/book-morocco.jpg";
import bali from "@/assets/dest-bali.jpg";

export const Route = createFileRoute("/account/")({
  head: () => ({
    meta: [
      { title: "Your library — Stacked Stone" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LibraryPage,
});

const books = [
  { title: "Kyoto, in winter", meta: "Journey Edition · 2026", img: kyoto },
  { title: "Iceland, alone", meta: "Collector Edition · 2025", img: iceland },
  { title: "Tangier notebook", meta: "Weekend Edition · 2025", img: morocco },
  { title: "Bali, between rains", meta: "Journey Edition · 2024", img: bali },
];

function LibraryPage() {
  return (
    <AccountShell>
      <section className="container-edit pt-20 md:pt-28 pb-12">
        <p className="eyebrow">Your library</p>
        <h1 className="display mt-6 text-5xl md:text-7xl">
          Four volumes,<br /><span className="italic">so far.</span>
        </h1>
        <p className="mt-8 text-muted-foreground max-w-md leading-relaxed">
          Every book you've commissioned, in the order you made it. Open one to revisit the spreads,
          or order another copy as a gift.
        </p>
      </section>

      {/* Bookshelf */}
      <section className="container-edit pb-32">
        <div className="relative pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-end">
            {books.map((b, i) => (
              <Link
                key={b.title}
                to="/preview"
                className={`group block ${i % 2 === 0 ? "md:mb-6" : "md:mb-0"}`}
              >
                <div className="img-zoom aspect-[3/4] book-shadow bg-stone-warm">
                  <img src={b.img} alt={b.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="font-serif text-xl mt-6 italic">{b.title}</p>
                <p className="eyebrow mt-2">{b.meta}</p>
              </Link>
            ))}
          </div>
          {/* shelf line */}
          <div className="mt-4 h-px bg-foreground/30" />
          <div className="h-3 bg-gradient-to-b from-foreground/15 to-transparent" />
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-10 border-t border-border pt-16">
          <Link to="/account/drafts" className="group">
            <p className="eyebrow">In progress</p>
            <h3 className="font-serif text-3xl mt-3">2 drafts</h3>
            <p className="text-muted-foreground mt-2">Quietly waiting on the desk.</p>
            <span className="btn-ghost mt-6 inline-flex">Open drafts →</span>
          </Link>
          <Link to="/account/orders" className="group">
            <p className="eyebrow">Recent orders</p>
            <h3 className="font-serif text-3xl mt-3">1 in transit</h3>
            <p className="text-muted-foreground mt-2">Kyoto, leaving Florence Friday.</p>
            <span className="btn-ghost mt-6 inline-flex">Track orders →</span>
          </Link>
          <Link to="/account/profile" className="group">
            <p className="eyebrow">You</p>
            <h3 className="font-serif text-3xl mt-3">Profile & addresses</h3>
            <p className="text-muted-foreground mt-2">Tend to your details.</p>
            <span className="btn-ghost mt-6 inline-flex">Edit profile →</span>
          </Link>
        </div>
      </section>
    </AccountShell>
  );
}
