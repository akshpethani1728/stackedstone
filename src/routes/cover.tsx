import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { SaveIndicator } from "@/components/studio/SaveIndicator";
import { BookMockup } from "@/components/studio/BookMockup";
import { coversFor } from "@/data";
import { useStudio } from "@/stores/studio";
import type { Cover } from "@/types";

export const Route = createFileRoute("/cover")({
  head: () => ({
    meta: [
      { title: "Choose your cover — Stacked Stone" },
      { name: "description", content: "Curated cover designs for your volume." },
    ],
  }),
  component: CoverPage,
});

function titleIdeas(name: string) {
  return [
    `My ${name} Story`,
    `${name} Memories`,
    `The ${name} Journals`,
    `Wandering ${name}`,
  ];
}

function CoverPage() {
  const navigate = useNavigate();
  const { state, patch, saveStatus } = useStudio();
  const allCovers = coversFor(state.destination?.slug);
  const [selected, setSelected] = useState<Cover | null>(state.cover ?? allCovers[0] ?? null);
  const [title, setTitle] = useState(state.title ?? "");

  useEffect(() => {
    if (allCovers.length > 0 && !allCovers.some((c) => c.slug === selected?.slug)) {
      setSelected(allCovers[0]);
    }
  }, [allCovers]);

  const syncTitle = useCallback(() => {
    if (title !== (state.title ?? "")) {
      patch({ title: title || undefined });
    }
  }, [title, state.title, patch]);

  const handleSelect = useCallback((c: Cover) => setSelected(c), []);

  const handleConfirm = useCallback(() => {
    if (!selected) return;
    patch({ cover: selected, title: title || undefined });
    navigate({ to: "/material" });
  }, [selected, title, patch, navigate]);

  if (!state.destination) {
    return (
      <StudioShell current="/cover">
        <section className="container-edit pt-32 pb-40 text-center">
          <p className="eyebrow">Step Three · The Cover</p>
          <h1 className="display mt-6 text-5xl">Choose a destination first.</h1>
          <Link to="/destination" className="btn-primary mt-10 inline-flex">Choose destination</Link>
        </section>
      </StudioShell>
    );
  }

  const destName = state.destination.name;
  const displayTitle = title || destName;
  const ideas = titleIdeas(destName);

  return (
    <StudioShell current="/cover">
      <SaveIndicator status={saveStatus} />

      {/* 1. Hero */}
      <section className="container-edit pt-10 md:pt-14 pb-6">
        <p className="eyebrow">Step Three · The Cover</p>
        <div className="grid md:grid-cols-12 gap-6 mt-4 items-end">
          <div className="md:col-span-8">
            <h1 className="display text-4xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight">
              The cover of<br />
              <span className="italic font-light">your {destName} book.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground text-sm leading-relaxed font-sans font-light">
            A cover is a held object — first impression is tactile before it is visual.
            Each design draws its palette from the destination itself.
            <span className="block mt-2.5 text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground/50 font-normal">
              Made in India · Premium cloth binding
            </span>
          </p>
        </div>
      </section>

      {/* 2. Live Preview + Title Editor */}
      <section className="container-edit pb-6 md:pb-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-7">
            <div className="reveal">
              <BookMockup
                cover={selected ?? allCovers[0]}
                destination={state.destination}
                edition={state.edition}
                title={displayTitle}
                size="lg"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-7 md:pt-8">
              {/* Title editor */}
              <div>
                <p className="eyebrow text-[0.55rem] mb-2">Title your story</p>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={syncTitle}
                  placeholder={destName}
                  className="w-full bg-transparent border-b border-border py-2 text-2xl md:text-3xl font-serif tracking-tight text-foreground placeholder:text-muted-foreground/20 outline-none focus:border-foreground/40 transition-colors"
                />
                <p className="text-[0.45rem] uppercase tracking-[0.25em] text-muted-foreground/35 mt-2 font-sans">
                  Leave blank to use "{destName}"
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {ideas.map((s) => {
                    const active = title === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setTitle(s); patch({ title: s }); }}
                        className={`px-3 py-1 text-[0.5rem] uppercase tracking-[0.2em] rounded-full border transition-all duration-200 font-sans ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "border-border/60 text-muted-foreground/50 hover:text-foreground hover:border-foreground/30"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected cover insight */}
              {selected && (
                <div className="animate-in fade-in slide-in-from-top-3 duration-500 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border border-border/40 shrink-0"
                      style={{ backgroundColor: selected.ink }}
                    />
                    <div>
                      <span className="font-serif text-lg tracking-tight">{selected.name}</span>
                      <span className="block text-[0.5rem] uppercase tracking-[0.25em] text-muted-foreground/50 font-sans mt-0.5">
                        {selected.mood}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans font-light">
                    {selected.mood}. {state.edition?.name ? `Designed for ${state.edition.name}. ` : ""}
                    The typography and palette are drawn from the textures and light of {destName}.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!selected}
                  className="btn-primary w-full md:w-auto group"
                >
                  Continue to Material
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M2.5 6h7M6 2.5l3.5 3.5L6 9.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Cover Gallery — all directions */}
      <section className="border-t border-border/40 py-14 md:py-20">
        <div className="container-edit">
          <div className="grid md:grid-cols-12 gap-6 items-end mb-10 md:mb-14">
            <div className="md:col-span-8">
              <p className="eyebrow text-[0.55rem]">Choose your direction</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-2 leading-[1.08] tracking-tight">
                Four covers,<br />
                <span className="italic">one destination</span>
              </h2>
            </div>
            <p className="md:col-span-4 text-sm text-muted-foreground leading-relaxed font-sans font-light">
              Each cover is a different reading of the same place. The one you choose
              changes how your story is first seen — and first held.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {allCovers.map((c, i) => {
              const isSelected = selected?.slug === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className={`group relative text-left w-full transition-all duration-500 reveal delay-${(i % 4) + 1} ${
                    isSelected ? "" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`relative rounded-sm overflow-hidden transition-all duration-500 ${
                      isSelected
                        ? "ring-2 ring-foreground/60 ring-offset-2 ring-offset-background"
                        : ""
                    }`}
                  >
                    <BookMockup
                      cover={c}
                      destination={state.destination}
                      edition={state.edition}
                      title={displayTitle}
                      size="sm"
                      className="w-full"
                    />
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-foreground flex items-center justify-center animate-in fade-in zoom-in duration-200">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-background">
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      </div>
                    )}
                    {i === 0 && !isSelected && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-foreground/90 text-background text-[0.4rem] uppercase tracking-[0.25em] font-sans font-medium shadow-lg">
                        Recommended
                      </div>
                    )}
                  </div>
                  <div className="mt-4 border-t border-border/40 pt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="eyebrow text-[0.45rem]">N° 0{i + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: c.ink }}
                        />
                        <span className="text-[0.45rem] uppercase tracking-[0.2em] text-muted-foreground/50 font-sans">
                          {c.mood.slice(0, 18)}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg tracking-tight">{c.name}</h3>
                    <p className="text-xs text-muted-foreground/70 italic mt-1 leading-snug font-sans font-light line-clamp-2">
                      {c.mood}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Trust footer */}
      <section className="border-t border-border/40 py-8 md:py-10">
        <div className="container-edit">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[0.5rem] uppercase tracking-[0.22em] text-muted-foreground/40 font-sans">
            <span className="flex items-center gap-1.5">
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2 4-4" /></svg>
              Made in India
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2 4-4" /></svg>
              Premium cloth binding
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2 4-4" /></svg>
              Free shipping across India
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5l2 2 4-4" /></svg>
              Love it or we'll fix it
            </span>
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
