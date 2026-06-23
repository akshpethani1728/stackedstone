import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AccountShell } from "@/components/studio/AccountShell";
import { OrderService } from "@/services/order.service";
import kyoto from "@/assets/book-kyoto.jpg";
import type { Order, OrderItem } from "@/types/checkout";

export const Route = createFileRoute("/account/orders/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Tracking ${params.id} — Stacked Stone` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetail,
});

const stageMap: { k: string; note: string }[] = [
  { k: "Confirmed", note: "Payment received. Order confirmed." },
  { k: "Printing", note: "Six-colour offset, Jaipur." },
  { k: "Quality Check", note: "Spine, signatures, colour pass." },
  { k: "Packaged", note: "Wrapped in muslin, sealed." },
  { k: "Shipped", note: "Courier · tracking active." },
  { k: "Delivered", note: "Into your hands." },
];

function stageIndex(status: string): number {
  const map: Record<string, number> = {
    pending: -1,
    confirmed: 0,
    printing: 1,
    quality_check: 2,
    packaged: 3,
    shipped: 4,
    delivered: 5,
    cancelled: -2,
  };
  return map[status] ?? -1;
}

function OrderDetail() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.getByOrderNumber(id)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AccountShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </AccountShell>
    );
  }

  if (!order) {
    return (
      <AccountShell>
        <section className="container-edit pt-20 md:pt-28 pb-32 text-center">
          <p className="font-serif text-3xl text-muted-foreground">Order not found</p>
          <Link to="/account/orders" className="btn-ghost mt-8 inline-flex">← All orders</Link>
        </section>
      </AccountShell>
    );
  }

  const current = stageIndex(order.status);
  const title = order.items?.[0]?.name ?? "Volume";

  return (
    <AccountShell>
      <section className="container-edit pt-20 md:pt-28 pb-12">
        <Link to="/account/orders" className="eyebrow text-muted-foreground hover:text-foreground">← All orders</Link>
        <div className="mt-10 grid md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">Order {order.order_number}</p>
            <h1 className="display mt-6 text-5xl md:text-7xl">{title}</h1>
            <p className="mt-6 text-muted-foreground">
              ₹{order.total} · {order.status}
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="img-zoom aspect-[3/4] book-shadow">
              <img src={kyoto} alt="Book cover" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-edit pb-32">
        <p className="eyebrow mb-12">Journey of the book</p>
        <ol className="relative border-l border-border ml-2 md:ml-6 space-y-14">
          {stageMap.map((s, i) => {
            const done = current >= i;
            const active = current === i;
            const cancelled = order.status === "cancelled";

            return (
              <li key={s.k} className="pl-10 md:pl-16 relative">
                <span
                  className={`absolute -left-[7px] top-2 h-3 w-3 rounded-full border ${
                    cancelled
                      ? "bg-red-400 border-red-400"
                      : done
                      ? "bg-ink border-ink"
                      : "bg-background border-border"
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
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-24 border-t border-border pt-12 grid md:grid-cols-3 gap-10">
          <div>
            <p className="eyebrow">Shipping to</p>
            <p className="font-serif text-2xl mt-3 italic">{order.address?.name ?? "—"}</p>
            <p className="text-muted-foreground mt-1">
              {order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ""}<br />
              {order.address?.city}{order.address?.state ? `, ${order.address.state}` : ""} {order.address?.postal_code}
            </p>
          </div>
          <div>
            <p className="eyebrow">Payment</p>
            <p className="font-serif text-2xl mt-3 italic">₹{order.total}</p>
            <p className="text-muted-foreground mt-1">
              {order.payment_method === "mock" ? "Test payment" : "Razorpay"} · {order.status}
            </p>
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
