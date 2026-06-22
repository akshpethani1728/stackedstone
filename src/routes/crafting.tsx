import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/crafting")({
  head: () => ({
    meta: [
      { title: "Crafting your book — Stacked Stone" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CraftingPage,
});

const moments = [
  "Sequencing your photographs by light…",
  "Choosing typography for each spread…",
  "Setting margins, easing whitespace…",
  "Calibrating ink to your palette…",
  "Folding signatures, dressing the spine…",
];

function CraftingPage() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);

  useEffect(() => {
    const ticker = setInterval(() => setI((v) => (v + 1) % moments.length), 1700);
    const done = setTimeout(() => navigate({ to: "/preview" }), 9000);
    return () => {
      clearInterval(ticker);
      clearTimeout(done);
    };
  }, [navigate]);

  return (
    <main className="min-h-screen bg-ink text-background flex flex-col items-center justify-center overflow-hidden relative">
      {/* ambient drift */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "radial-gradient(circle at 30% 30%, #fff 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* book */}
      <div className="relative" style={{ perspective: "1800px" }}>
        <div className="relative w-[260px] md:w-[380px] aspect-[3/4] book-shadow">
          <div className="absolute inset-0 bg-stone-warm" style={{ animation: "coverIn 1.4s cubic-bezier(.2,.7,.2,1) forwards" }} />
          {/* pages */}
          {[0, 1, 2, 3].map((n) => (
            <div
              key={n}
              className="absolute inset-y-3 left-1/2 origin-left bg-background"
              style={{
                width: "calc(50% - 0.75rem)",
                transformStyle: "preserve-3d",
                transform: "rotateY(0deg)",
                animation: `pageTurn 2.6s cubic-bezier(.4,0,.3,1) ${1 + n * 0.55}s infinite`,
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4)",
              }}
            />
          ))}
          <div className="absolute inset-y-3 right-1/2 bg-background/95" style={{ width: "calc(50% - 0.75rem)" }} />
        </div>
        <style>{`
          @keyframes coverIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pageTurn {
            0% { transform: rotateY(0deg); }
            50%, 100% { transform: rotateY(-170deg); }
          }
        `}</style>
      </div>

      <p className="eyebrow !text-background/60 mt-20">Volume in progress</p>
      <p className="font-serif italic text-2xl md:text-3xl mt-6 max-w-md text-center px-6 min-h-[3em] transition-opacity duration-500">
        {moments[i]}
      </p>

      <div className="mt-16 w-48 h-px bg-background/20 overflow-hidden">
        <div className="h-full bg-background" style={{ animation: "fill 9s linear forwards", width: 0 }} />
      </div>
      <style>{`@keyframes fill { to { width: 100%; } }`}</style>
    </main>
  );
}
