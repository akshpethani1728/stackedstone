import hero from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={hero}
          alt="Misty mountain valley at golden hour"
          width={1920}
          height={1280}
          className="h-full w-full object-cover kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full container-edit flex flex-col">
        <div className="flex-1" />

        <div className="max-w-3xl pb-20 md:pb-28">
          <p className="eyebrow reveal text-background/80">Volume One · 2026</p>
          <h1 className="display reveal delay-1 mt-6 text-[14vw] md:text-[7.5vw] lg:text-[6.4rem] text-background">
            The places<br />
            <span className="italic font-light">you carried</span><br />
            home.
          </h1>
          <p className="reveal delay-2 mt-8 max-w-md text-background/85 text-[15px] leading-relaxed font-light">
            Stacked Stone turns your travel photographs into archival coffee-table
            books — bound by hand, designed for the shelf, made to outlive the screen.
          </p>
          <div className="reveal delay-3 mt-10 flex flex-wrap items-center gap-8">
            <a href="#create" className="btn-primary !bg-background !text-ink !border-background hover:!bg-transparent hover:!text-background">
              Begin your book
            </a>
            <a href="#collections" className="btn-ghost text-background/90">
              View the collection
            </a>
          </div>
        </div>

        <div className="reveal delay-4 pb-8 flex items-center justify-between text-background/70 text-[0.7rem] uppercase tracking-[0.28em]">
          <span>Est. Mumbai · Worldwide shipping</span>
          <span className="hidden sm:inline">Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
