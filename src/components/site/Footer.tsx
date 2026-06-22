import { Link } from "@tanstack/react-router";

type Col = {
  title: string;
  items: { label: string; to?: string; href?: string }[];
};

const cols: Col[] = [
  {
    title: "Shop",
    items: [
      { label: "Editions", to: "/destination" },
      { label: "Explore", to: "/explore" },
      { label: "Gift", to: "/destination" },
      { label: "Account", to: "/account" },
    ],
  },
  {
    title: "Studio",
    items: [
      { label: "About", to: "/about" },
      { label: "The Bindery", to: "/about" },
      { label: "Journal", to: "/explore" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Care",
    items: [
      { label: "Shipping", to: "/legal/shipping" },
      { label: "Refunds", to: "/legal/refund" },
      { label: "FAQ", to: "/faq" },
      { label: "Press", href: "mailto:press@stackedstone.co" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container-edit py-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="font-serif text-3xl">
              Stacked <span className="italic">Stone</span>
            </div>
            <p className="mt-6 max-w-sm text-muted-foreground leading-relaxed">
              A small studio publishing travel books for the people who lived them.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-10 flex items-center gap-4 max-w-sm border-b border-border pb-3"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <button className="eyebrow text-foreground">Subscribe →</button>
            </form>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <p className="eyebrow">{c.title}</p>
              <ul className="mt-6 space-y-3">
                {c.items.map((i) =>
                  i.to ? (
                    <li key={i.label}>
                      <Link to={i.to} className="text-sm text-foreground/80 hover:text-foreground hover:italic transition-all">
                        {i.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={i.label}>
                      <a href={i.href} className="text-sm text-foreground/80 hover:text-foreground hover:italic transition-all">
                        {i.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1">
            <p className="eyebrow">Social</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li><a href="https://instagram.com" className="hover:text-foreground text-foreground/80">IG</a></li>
              <li><a href="https://pinterest.com" className="hover:text-foreground text-foreground/80">PIN</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
          <span>© 2026 Stacked Stone Studio · Mumbai & Florence</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/legal/refund" className="hover:text-foreground">Refund</Link>
            <Link to="/legal/shipping" className="hover:text-foreground">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
