import { useEffect, useState } from "react";

const links = [
  { label: "Collections", href: "#collections" },
  { label: "Process", href: "#process" },
  { label: "Craft", href: "#craft" },
  { label: "Journal", href: "#journal" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="container-edit flex items-center justify-between py-5">
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-serif text-[1.35rem] tracking-tight leading-none">
            Stacked<span className="italic"> Stone</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-12">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-[0.72rem] uppercase tracking-[0.28em] text-foreground/70 hover:text-foreground">
            Sign in
          </a>
          <a href="#create" className="btn-primary !py-3 !px-5">
            Create yours
          </a>
        </div>

        <button
          aria-label="Open menu"
          className="md:hidden h-9 w-9 flex flex-col items-center justify-center gap-[5px]"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-px w-6 bg-foreground transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-foreground transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="container-edit py-8 flex flex-col gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif text-3xl"
              >
                {l.label}
              </a>
            ))}
            <a href="#create" className="btn-primary mt-4 w-fit">Create yours</a>
          </div>
        </div>
      )}
    </header>
  );
}
