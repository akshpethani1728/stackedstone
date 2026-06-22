import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountShell } from "@/components/studio/AccountShell";
import kyoto from "@/assets/book-kyoto.jpg";
import iceland from "@/assets/book-iceland.jpg";
import morocco from "@/assets/book-morocco.jpg";

export const Route = createFileRoute("/account/orders/")({
  head: () => ({ meta: [{ title: "Orders — Stacked Stone" }, { name: "robots", content: "noindex" }] }),
  component: OrdersList,
});

const orders = [
  { id: "SS-K9X2A", title: "Kyoto, in winter", img: kyoto, status: "Shipped", stage: 4, eta: "Arriving Friday" },
  { id: "SS-LM3PQ", title: "Iceland, alone", img: iceland, status: "Delivered", stage: 5, eta: "Delivered Mar 12" },
  { id: "SS-T8VRJ", title: "Tangier notebook", img: morocco, status: "Printing", stage: 1, eta: "Ships in 6 days" },
];

function OrdersList() {
  return (
    <AccountShell>
      <section className="container-edit pt-20 md:pt-28 pb-12">
        <p className="eyebrow">Orders</p>
        <h1 className="display mt-6 text-5xl md:text-7xl">Where each<br /><span className="italic">volume is.</span></h1>
      </section>
      <section className="container-edit pb-32">
        <div className="border-t border-border">
          {orders.map((o) => (
            <Link
              key={o.id}
              to="/account/orders/$id"
              params={{ id: o.id }}
              className="group grid grid-cols-12 gap-6 items-center py-10 border-b border-border hover:bg-beige/40 transition-colors px-2"
            >
              <div className="col-span-3 md:col-span-2">
                <div className="aspect-[3/4] book-shadow img-zoom">
                  <img src={o.img} alt={o.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="col-span-9 md:col-span-4">
                <p className="eyebrow">{o.id}</p>
                <h3 className="font-serif text-2xl md:text-3xl mt-2 italic">{o.title}</h3>
              </div>
              <div className="col-span-6 md:col-span-3">
                <p className="eyebrow">Stage</p>
                <p className="font-serif text-xl mt-2">{o.status}</p>
              </div>
              <div className="col-span-6 md:col-span-2">
                <p className="eyebrow">ETA</p>
                <p className="font-serif text-xl mt-2 italic">{o.eta}</p>
              </div>
              <div className="hidden md:flex col-span-1 justify-end">
                <span className="eyebrow opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AccountShell>
  );
}
