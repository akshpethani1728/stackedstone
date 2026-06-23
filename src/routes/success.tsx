import { createFileRoute, Link } from "@tanstack/react-router";
import { useStudio } from "@/stores/studio";
import { useEffect, useState } from "react";
import { OrderService } from "@/services/order.service";
import bookStack from "@/assets/book-stack.jpg";
import type { Order } from "@/types/checkout";

export const Route = createFileRoute("/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" ? search.order : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your volume is on its way — Stacked Stone" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { order: orderNumber } = Route.useSearch();
  const { state } = useStudio();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      OrderService.getByOrderNumber(orderNumber).then(setOrder).catch(() => setOrderError(true));
    }
  }, [orderNumber]);

  const displayOrder = order?.order_number ?? (orderError ? orderNumber : null) ?? "";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="container-edit py-6">
        <Link to="/" className="font-serif text-[1.2rem]">Stacked<span className="italic"> Stone</span></Link>
      </header>

      <section className="container-edit pt-16 md:pt-24 grid md:grid-cols-12 gap-16 items-center pb-32">
        <div className="md:col-span-6 md:order-2">
          <div className="img-zoom aspect-[4/5] book-shadow">
            <img src={bookStack} alt="Your book" loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="md:col-span-6 md:order-1">
          {displayOrder && <p className="eyebrow reveal">Order {displayOrder}</p>}
          <h1 className="display reveal delay-1 mt-6 text-6xl md:text-8xl tracking-tight">
            Your book<br />is being<br /><span className="italic">made.</span>
          </h1>
          <p className="reveal delay-2 mt-10 max-w-md text-muted-foreground leading-relaxed">
            {state.title || state.destination?.name || "Your volume"} has entered our Jaipur
            bindery. The press will run in the morning. You'll receive a quiet update at every stage —
            no spam, only the truth.
          </p>

          <div className="reveal delay-3 mt-14 grid grid-cols-2 gap-8 max-w-md">
            <div>
              <p className="eyebrow">Expected with you</p>
              <p className="font-serif text-2xl mt-2 italic">in 10–14 days</p>
            </div>
            <div>
              <p className="eyebrow">Edition</p>
              <p className="font-serif text-2xl mt-2 italic">{state.edition?.name ?? "Journey"}</p>
            </div>
          </div>

          <div className="reveal delay-4 mt-14 flex flex-wrap items-center gap-8">
            {displayOrder ? (
              <Link to="/account/orders/$id" params={{ id: displayOrder }} className="btn-primary">
                Track your book
              </Link>
            ) : (
              <Link to="/account" className="btn-primary">Visit your library</Link>
            )}
            <Link to="/account" className="btn-ghost">All your books</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
