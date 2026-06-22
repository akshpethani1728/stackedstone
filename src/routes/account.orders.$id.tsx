import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountShell } from "@/components/studio/AccountShell";
import kyoto from "@/assets/book-kyoto.jpg";

export const Route = createFileRoute("/account/orders/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Tracking ${params.id} — Stacked Stone` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetail,
});

const stages = [
  { k: "Book Created", note: "Files received. Sequencing approved.", date: "Mar 02" },
  { k: "Printing", note: "Six-colour offset, Jaipur.", date: "Mar 04" },
  { k: "Quality Check", note: "Spine, signatures, colour pass.", date: "Mar 06" },
  { k: "Packaging", note: "Wrapped in muslin, sealed.", date: "Mar 07" },
  { k: "Shipped", note: "Courier · tracking active.", date: "Mar 08" },
  { k: "Delivered", note: "Into your hands.", date: "—" },
];

function OrderDetail() {
  const { id } = Route.useParams();
  const current = 4; // shipped

  return (
    <AccountShell>
      <section className="container-edit pt-20 md:pt-28 pb-12">
        <Link to="/account/orders" className="eyebrow text-muted-foreground hover:text-foreground">← All orders</Link>
        <div className="mt-10 grid md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">Order {id}</p>
            <h1 className="display mt-6 text-5xl md:text-7xl">Kyoto, in <span className="italic">winter.</span></h1>
            <p className="mt-6 text-muted-foreground">Journey Edition · 120 pages · 10 × 12 in</p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="img-zoom aspect-[3/4] book-shadow">
              <img src={kyoto} alt="Kyoto book cover" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-edit pb-32">
        <p className="eyebrow mb-12">Journey of the book</p>
        <ol className="relative border-l border-border ml-2 md:ml-6 space-y-14">
          {stages.map((s, i) => {
            const done = i <= current;
            const active = i === current;
            return (
              <li key={s.k} className="pl-10 md:pl-16 relative">
                <span
                  className={`absolute -left-[7px] top-2 h-3 w-3 rounded-full border ${
                    done ? "bg-ink border-ink" : "bg-background border-border"
                  } ${active ? "ring-4 ring-ink/10" : ""}`}
                />
                <div className="flex items-baseline justify-between gap-6">
                  <div>
                    <p className="eyebrow">Stage {String(i + 1).padStart(2, "0")}</p>
                    <h3 className={`font-serif text-3xl md:text-4xl mt-3 ${done ? "" : "text-muted-foreground/70"}`}>
                      {active ? <span className="italic">{s.k}</span> : s.k}
                    </h3>
                    <p className="mt-3 text-muted-foreground max-w-md">{s.note}</p>
                  </div>
                  <p className="eyebrow shrink-0">{s.date}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-24 border-t border-border pt-12 grid md:grid-cols-3 gap-10">
          <div>
            <p className="eyebrow">Shipping to</p>
            <p className="font-serif text-2xl mt-3 italic">Aanya Raman</p>
            <p className="text-muted-foreground mt-1">14 Carter Road, Bandra West<br />Mumbai 400050, India</p>
          </div>
          <div>
            <p className="eyebrow">Courier</p>
            <p className="font-serif text-2xl mt-3 italic">Premium courier</p>
            <p className="text-muted-foreground mt-1">Tracking · 1Z 9X4 88K 421</p>
          </div>
          <div>
            <p className="eyebrow">Need a hand?</p>
            <p className="font-serif text-2xl mt-3 italic">studio@stackedstone.co</p>
            <p className="text-muted-foreground mt-1">We reply within a working day.</p>
          </div>
        </div>
      </section>
    </AccountShell>
  );
}
