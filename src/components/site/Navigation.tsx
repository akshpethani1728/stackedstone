import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AuthService } from "@/services/auth.service";

const links = [
  { label: "Explore", to: "/explore" as const },
  { label: "About", to: "/about" as const },
  { label: "FAQ", to: "/faq" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<unknown | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => {
    AuthService.getUser().then(setUser).catch(() => setUser(null));
  }, []);

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
          {user ? (
            <Link to="/account" className="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/70 hover:text-foreground">
              Library
            </Link>
          ) : (
            <Link to="/login" className="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/70 hover:text-foreground">
              Sign in
            </Link>
          )}
          <Link to="/destination" className="btn-primary !py-3 !px-5">
            Begin a book
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden relative w-7 h-5 flex flex-col justify-center">
          <span className={`block h-px bg-current transition-all duration-300 ${open ? "rotate-45 translate-y-0" : "-translate-y-1.5"}`} />
          <span className={`block h-px bg-current transition-all duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-px bg-current transition-all duration-300 ${open ? "-rotate-45 translate-y-0" : "translate-y-1.5"}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-96" : "max-h-0"}`}>
        <div className="container-edit pb-8 space-y-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="block text-[0.72rem] uppercase tracking-[0.28em]">{l.label}</Link>
          ))}
          <hr className="border-border/60" />
          {user ? (
            <Link to="/account" className="block text-[0.72rem] uppercase tracking-[0.28em]">Library</Link>
          ) : (
            <Link to="/login" className="block text-[0.72rem] uppercase tracking-[0.28em]">Sign in</Link>
          )}
          <Link to="/destination" className="btn-primary inline-flex">Begin a book</Link>
        </div>
      </div>
    </header>
  );
}
