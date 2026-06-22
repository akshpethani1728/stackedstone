import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const links = [
  { label: "Explore", to: "/explore" as const },
  { label: "About", to: "/about" as const },
  { label: "FAQ", to: "/faq" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        transparent
          ? "bg-transparent"
          : "bg-background/85 backdrop-blur-xl border-b border-border/60"
      }`}
    >
      <div className="container-edit flex items-center justify-between py-5">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif text-[1.35rem] tracking-tight leading-none">
            Stacked<span className="italic"> Stone</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-12">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground transition-colors story-underline"
              activeProps={{ className: "text-[0.72rem] uppercase tracking-[0.28em] text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/account" className="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/70 hover:text-foreground">
            Account
          </Link>
          <Link to="/destination" className="btn-primary !py-3 !px-5">
            Create yours
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden h-9 w-9 flex flex-col items-center justify-center gap-[5px]"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-px w-6 bg-foreground transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-foreground transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="container-edit py-10 flex flex-col gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-serif text-4xl tracking-tight"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/account" className="font-serif text-2xl text-muted-foreground mt-2">Account</Link>
            <Link to="/destination" className="btn-primary mt-6 w-fit">Create yours</Link>
          </div>
        </div>
      )}
    </header>
  );
}
