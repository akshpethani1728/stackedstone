import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const tabs = [
  { to: "/account", label: "Library", exact: true },
  { to: "/account/drafts", label: "Drafts" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/profile", label: "Profile" },
];

export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 sticky top-0 z-40 bg-background/85 backdrop-blur-xl">
        <div className="container-edit flex items-center justify-between py-5">
          <Link to="/" className="font-serif text-[1.2rem] leading-none">
            Stacked<span className="italic"> Stone</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {tabs.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={{ exact: t.exact }}
                activeProps={{ className: "text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground/70 hover:text-foreground" }}
                className="text-[0.68rem] uppercase tracking-[0.28em] transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <Link to="/create" className="btn-primary !py-3 !px-5">Begin a volume</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
