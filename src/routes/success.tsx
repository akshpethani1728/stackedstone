import { createFileRoute, Link } from "@tanstack/react-router";
import { useStudio } from "@/lib/studio-store";
import bookStack from "@/assets/book-stack.jpg";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [
      { title: "Your volume is on its way — Stacked Stone" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { state } = useStudio();
  const orderNo = "SS-" + Math.random().toString(36).slice(2, 7).toUpperCase();

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
          <p className="eyebrow reveal">Order {orderNo}</p>
          <h1 className="display reveal delay-1 mt-6 text-6xl md:text-8xl tracking-tight">
            Your book<br />is being<br /><span className="italic">made.</span>
          </h1>
          <p className="reveal delay-2 mt-10 max-w-md text-muted-foreground leading-relaxed">
            {state.title || state.destination?.name || "Your volume"} has entered our Florence
            bindery. The press will run in the morning. You'll receive a quiet update at every stage —
            no spam, only the truth.
          </p>

          <div className="reveal delay-3 mt-14 grid grid-cols-2 gap-8 max-w-md">
            <div>
              <p className="eyebrow">Expected with you</p>
              <p className="font-serif text-2xl mt-2 italic">in 14–18 days</p>
            </div>
            <div>
              <p className="eyebrow">Edition</p>
              <p className="font-serif text-2xl mt-2 italic">{state.edition?.name ?? "Journey"}</p>
            </div>
          </div>

          <div className="reveal delay-4 mt-14 flex flex-wrap items-center gap-8">
            <Link to="/account/orders/$id" params={{ id: orderNo }} className="btn-primary">
              Track your book
            </Link>
            <Link to="/account" className="btn-ghost">Visit your library</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
