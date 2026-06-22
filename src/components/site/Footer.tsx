export function Footer() {
  const cols = [
    { title: "Shop", items: ["Editions", "Custom Volumes", "Gift Cards", "Slipcases"] },
    { title: "Studio", items: ["About", "The Bindery", "Journal", "Contact"] },
    { title: "Care", items: ["Shipping", "Returns", "FAQ", "Press"] },
  ];
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
            <form className="mt-10 flex items-center gap-4 max-w-sm border-b border-border pb-3">
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
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-foreground/80 hover:text-foreground">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1">
            <p className="eyebrow">Social</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li><a href="#" className="hover:text-foreground text-foreground/80">IG</a></li>
              <li><a href="#" className="hover:text-foreground text-foreground/80">PIN</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
          <span>© 2026 Stacked Stone Studio · Mumbai</span>
          <span>Printed slowly, on uncoated paper.</span>
        </div>
      </div>
    </footer>
  );
}
