import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AccountShell } from "@/components/studio/AccountShell";
import { useDrafts } from "@/hooks/use-drafts";
import { useStudio } from "@/stores/studio";

export const Route = createFileRoute("/account/drafts")({
  head: () => ({ meta: [{ title: "Drafts — Stacked Stone" }, { name: "robots", content: "noindex" }] }),
  component: DraftsPage,
});

function DraftsPage() {
  const navigate = useNavigate();
  const { loadDraft } = useStudio();
  const { drafts, loading } = useDrafts();

  const handleResume = async (id: string) => {
    await loadDraft(id);
    navigate({ to: "/destination" });
  };

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
        <p className="eyebrow">Drafts</p>
        <h1 className="display mt-6 text-5xl md:text-7xl">On the <span className="italic">desk.</span></h1>
        {drafts.length === 0 && (
          <p className="mt-8 text-muted-foreground max-w-md leading-relaxed">No drafts yet. Start a new book from your library.</p>
        )}
      </section>
      {drafts.length > 0 && (
        <section className="container-edit pb-32 space-y-16">
          {drafts.map((d: any, i) => {
            const dest = d.destination ?? null;
            return (
              <article key={d.id} className="grid md:grid-cols-12 gap-10 items-center border-b border-border pb-16">
                <div className={`md:col-span-5 ${i % 2 ? "md:order-2" : ""}`}>
                  <div className="img-zoom aspect-[4/3] book-shadow bg-stone-warm flex items-center justify-center">
                    <span className="font-serif text-7xl italic text-muted-foreground/20">—</span>
                  </div>
                </div>
                <div className="md:col-span-6">
                  <p className="eyebrow">{d.edition_id ? "Edition selected" : "Destination only"}</p>
                  <h2 className="font-serif text-4xl md:text-5xl italic mt-4">{dest?.name ?? "Untitled"}</h2>
                  <p className="mt-4 text-muted-foreground">{dest?.region ?? "No destination yet"} · {new Date(d.updated_at).toLocaleDateString()}</p>
                  <div className="mt-10 flex items-center gap-8">
                    <button onClick={() => handleResume(d.id)} className="btn-primary">Continue editing</button>
                    <button onClick={async () => {
                      const { BookService } = await import("@/services/book.service");
                      await BookService.softDelete(d.id);
                      window.location.reload();
                    }} className="btn-ghost text-muted-foreground">Discard</button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </AccountShell>
  );
}
