import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

const links = [
  { to: "/legal/privacy", label: "Privacy" },
  { to: "/legal/refund", label: "Refund" },
  { to: "/legal/shipping", label: "Shipping" },
  { to: "/legal/terms", label: "Terms" },
] as const;

export function LegalLayout({
  eyebrow,
  title,
  italic,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="container-edit pt-40 md:pt-48 pb-16">
        <p className="eyebrow reveal">{eyebrow}</p>
        <h1 className="display mt-6 text-5xl md:text-7xl max-w-3xl reveal delay-1">
          {title}{italic && <> <span className="italic">{italic}</span></>}
        </h1>
        <p className="mt-8 eyebrow text-muted-foreground">Last updated · {updated}</p>
      </section>

      <section className="container-edit pb-32 md:pb-48 grid md:grid-cols-12 gap-16">
        <aside className="md:col-span-3">
          <p className="eyebrow">Documents</p>
          <ul className="mt-6 space-y-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-serif text-2xl text-foreground/70 hover:text-foreground hover:italic transition-all"
                  activeProps={{ className: "font-serif text-2xl text-foreground italic" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <article className="md:col-span-8 md:col-start-5 prose-stacked">
          {children}
        </article>
      </section>

      <Footer />
    </main>
  );
}
