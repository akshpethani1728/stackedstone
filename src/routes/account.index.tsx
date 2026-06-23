import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AccountShell } from "@/components/studio/AccountShell";
import { useDrafts, useBooks } from "@/hooks/use-drafts";
import { useStudio } from "@/stores/studio";
import { useState, useEffect } from "react";
import { OrderService } from "@/services/order.service";

export const Route = createFileRoute("/account/")({
  head: () => ({
    meta: [
      { title: "Your library — Stacked Stone" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const navigate = useNavigate();
  const { createDraft } = useStudio();
  const { books, loading: booksLoading } = useBooks();
  const { count: draftCount, loading: draftsLoading } = useDrafts();
  const [orderCount, setOrderCount] = useState(0);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    OrderService.list().then((orders) => {
      setOrderCount(orders.filter((o) => ["confirmed", "printing", "quality_check", "packaged", "shipped"].includes(o.status)).length);
    }).catch(() => {});
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await createDraft();
      navigate({ to: "/destination" });
    } catch {
      setCreating(false);
    }
  };

  if (booksLoading || draftsLoading) {
    return (
      <AccountShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </AccountShell>
    );
  }

  const completedBooks = books.filter((b) => !["draft", "uploading", "generating", "preview_ready"].includes(b.status));

  return (
    <AccountShell>
      <section className="container-edit pt-20 md:pt-28 pb-12">
        <p className="eyebrow">Your library</p>
        <h1 className="display mt-6 text-5xl md:text-7xl">
          {books.length === 0
            ? "Begin your first<br /><span className=\"italic\">volume.</span>"
            : `Your shelf,<br /><span className=\"italic\">in progress.</span>`}
        </h1>
        <p className="mt-8 text-muted-foreground max-w-md leading-relaxed">
          {books.length === 0
            ? "A book begins with a place. Choose a destination, choose the edition, and we will craft it by hand."
            : "Every book you've commissioned, in the order you made it."}
        </p>
      </section>

      {books.length === 0 ? (
        <section className="container-edit pb-32">
          <div className="border border-border/60 border-dashed rounded-lg p-20 text-center max-w-2xl mx-auto">
            <p className="font-serif text-5xl italic text-muted-foreground/40">—</p>
            <h3 className="font-serif text-3xl mt-8">The shelf is empty</h3>
            <p className="text-muted-foreground mt-4 max-w-sm mx-auto leading-relaxed">
              Every volume begins with a place. Pick a destination, and let the binding begin.
            </p>
            <button onClick={handleCreate} disabled={creating} className="btn-primary mt-10 inline-flex">
              {creating ? "Preparing…" : "Create your first book"}
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="container-edit pb-32">
            <div className="relative pt-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-end">
                {completedBooks.slice(0, 4).map((b) => (
                  <Link
                    key={b.id}
                    to="/preview"
                    className="group block"
                  >
                    <div className="img-zoom aspect-[3/4] book-shadow bg-stone-warm flex items-center justify-center">
                      <span className="font-serif text-6xl italic text-muted-foreground/30">—</span>
                    </div>
                    <p className="font-serif text-xl mt-6 italic">{b.title ?? "Untitled"}</p>
                    <p className="eyebrow mt-2">{b.status}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 h-px bg-foreground/30" />
              <div className="h-3 bg-gradient-to-b from-foreground/15 to-transparent" />
            </div>

            <div className="mt-32 grid md:grid-cols-3 gap-10 border-t border-border pt-16">
              {draftCount > 0 && (
                <Link to="/account/drafts" className="group">
                  <p className="eyebrow">In progress</p>
                  <h3 className="font-serif text-3xl mt-3">{draftCount} {draftCount === 1 ? "draft" : "drafts"}</h3>
                  <p className="text-muted-foreground mt-2">Quietly waiting on the desk.</p>
                  <span className="btn-ghost mt-6 inline-flex">Open drafts →</span>
                </Link>
              )}
              <Link to="/account/orders" className="group">
                <p className="eyebrow">Recent orders</p>
                <h3 className="font-serif text-3xl mt-3">
                  {orderCount > 0 ? `${orderCount} in transit` : "No active orders"}
                </h3>
                <p className="text-muted-foreground mt-2">Track your orders.</p>
                <span className="btn-ghost mt-6 inline-flex">Track orders →</span>
              </Link>
              <Link to="/account/profile" className="group">
                <p className="eyebrow">You</p>
                <h3 className="font-serif text-3xl mt-3">Profile & addresses</h3>
                <p className="text-muted-foreground mt-2">Tend to your details.</p>
                <span className="btn-ghost mt-6 inline-flex">Edit profile →</span>
              </Link>
              <button onClick={handleCreate} disabled={creating} className="group text-left">
                <p className="eyebrow">New</p>
                <h3 className="font-serif text-3xl mt-3">Start a new book</h3>
                <p className="text-muted-foreground mt-2">Begin a fresh volume.</p>
                <span className="btn-ghost mt-6 inline-flex">{creating ? "Preparing…" : "Create →"}</span>
              </button>
            </div>
          </section>
        </>
      )}
    </AccountShell>
  );
}
