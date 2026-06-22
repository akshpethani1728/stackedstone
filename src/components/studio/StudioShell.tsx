import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const steps = [
  { n: "01", label: "Destination",   to: "/destination" },
  { n: "02", label: "Edition",       to: "/create" },
  { n: "03", label: "Cover",         to: "/cover" },
  { n: "04", label: "Material",      to: "/material" },
  { n: "05", label: "Paper",         to: "/paper" },
  { n: "06", label: "Pages",         to: "/pages" },
  { n: "07", label: "Photographs",   to: "/upload" },
  { n: "08", label: "Preview",       to: "/preview" },
] as const;

export function StudioShell({
  current,
  children,
}: {
  current?: string;
  children: ReactNode;
}) {
  const activeIndex = steps.findIndex((s) => s.to === current);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/60 bg-background/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="container-edit flex items-center justify-between py-5 gap-6">
          <Link to="/" className="font-serif text-[1.2rem] leading-none shrink-0">
            Stacked<span className="italic"> Stone</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 overflow-hidden">
            {steps.map((s, i) => {
              const active = s.to === current;
              const past = activeIndex > -1 && i < activeIndex;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`flex items-center gap-2.5 text-[0.62rem] uppercase tracking-[0.28em] transition-colors whitespace-nowrap ${
                    active
                      ? "text-foreground"
                      : past
                      ? "text-foreground/55 hover:text-foreground"
                      : "text-muted-foreground/55 hover:text-foreground"
                  }`}
                >
                  <span className={`font-serif italic text-sm ${active ? "text-foreground" : past ? "text-foreground/55" : "text-muted-foreground/45"}`}>{s.n}</span>
                  <span>{s.label}</span>
                </Link>
              );
            })}
          </nav>

          <Link to="/account" className="text-[0.66rem] uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground shrink-0">
            Library
          </Link>
        </div>

        {/* Mobile progress bar */}
        <div className="lg:hidden h-px bg-border relative">
          {activeIndex > -1 && (
            <div
              className="absolute inset-y-0 left-0 bg-foreground transition-all duration-700"
              style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
            />
          )}
        </div>
        <div className="lg:hidden container-edit py-2 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
          <span>{activeIndex > -1 ? `Step ${steps[activeIndex].n} · ${steps[activeIndex].label}` : "Studio"}</span>
          <span>{activeIndex > -1 ? `${activeIndex + 1} / ${steps.length}` : ""}</span>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
