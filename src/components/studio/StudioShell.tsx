import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const steps = [
  { n: "01", label: "Edition", to: "/create" },
  { n: "02", label: "Destination", to: "/destination" },
  { n: "03", label: "Photographs", to: "/upload" },
  { n: "04", label: "Preview", to: "/preview" },
  { n: "05", label: "Checkout", to: "/checkout" },
];

export function StudioShell({
  current,
  children,
}: {
  current?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-xl sticky top-0 z-40">
        <div className="container-edit flex items-center justify-between py-5">
          <Link to="/" className="font-serif text-[1.2rem] leading-none">
            Stacked<span className="italic"> Stone</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {steps.map((s) => {
              const active = s.to === current;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground/70 hover:text-foreground"
                  }`}
                >
                  <span className={`font-serif italic text-base ${active ? "text-foreground" : "text-muted-foreground/50"}`}>{s.n}</span>
                  <span>{s.label}</span>
                </Link>
              );
            })}
          </nav>
          <Link to="/account" className="text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground">
            Library
          </Link>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
