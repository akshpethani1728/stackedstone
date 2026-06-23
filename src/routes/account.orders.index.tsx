import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AccountShell } from "@/components/studio/AccountShell";
import { OrderService } from "@/services/order.service";
import type { Order } from "@/types/checkout";

export const Route = createFileRoute("/account/orders/")({
  head: () => ({ meta: [{ title: "Orders — Stacked Stone" }, { name: "robots", content: "noindex" }] }),
  component: OrdersList,
});

const statusLabel: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  quality_check: "Quality Check",
  packaged: "Packaged",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderService.list()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AccountShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell>
      <section className="container-edit pt-20 md:pt-28 pb-12">
        <p className="eyebrow">Orders</p>
        <h1 className="display mt-6 text-5xl md:text-7xl">Where each<br /><span className="italic">volume is.</span></h1>
      </section>
      <section className="container-edit pb-32">
        <div className="border-t border-border">
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-3xl text-muted-foreground italic">No orders yet</p>
              <Link to="/destination" className="btn-primary mt-8 inline-flex">Create your first book</Link>
            </div>
          ) : (
            orders.map((o) => (
              <Link
                key={o.id}
                to="/account/orders/$id"
                params={{ id: o.order_number }}
                className="group grid grid-cols-12 gap-6 items-center py-10 border-b border-border hover:bg-beige/40 transition-colors px-2"
              >
                <div className="col-span-9 md:col-span-5">
                  <p className="eyebrow">{o.order_number}</p>
                  <h3 className="font-serif text-2xl md:text-3xl mt-2 italic">
                    {o.items?.[0]?.name ?? "Volume"}
                  </h3>
                </div>
                <div className="col-span-6 md:col-span-3">
                  <p className="eyebrow">Status</p>
                  <p className="font-serif text-xl mt-2">{statusLabel[o.status] ?? o.status}</p>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <p className="eyebrow">Total</p>
                  <p className="font-serif text-xl mt-2 italic">₹{o.total}</p>
                </div>
                <div className="hidden md:flex col-span-1 justify-end items-end flex-col">
                  <p className="eyebrow text-right">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  <span className="eyebrow opacity-0 group-hover:opacity-100 transition-opacity mt-2">Open →</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </AccountShell>
  );
}
