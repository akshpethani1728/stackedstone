import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { useStudio } from "@/lib/studio-store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Add your photographs — Stacked Stone" },
      { name: "description", content: "Lay your photographs on the studio table. We'll do the rest." },
    ],
  }),
  component: UploadPage,
});

type Photo = { id: string; url: string; rot: number; x: number; y: number };

function UploadPage() {
  const navigate = useNavigate();
  const { state, patch } = useStudio();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Photo[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 24)
      .map((f, i) => ({
        id: `${Date.now()}-${i}`,
        url: URL.createObjectURL(f),
        rot: (Math.random() - 0.5) * 12,
        x: Math.random() * 60 - 30,
        y: Math.random() * 30 - 15,
      }));
    setPhotos((p) => [...p, ...next].slice(0, 36));
  };

  const proceed = () => {
    patch({ photoCount: photos.length || 24, title: state.title ?? state.destination?.name });
    navigate({ to: "/crafting" });
  };

  return (
    <StudioShell current="/upload">
      <section className="container-edit pt-24 md:pt-28 pb-10">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">Step Three · The Photographs</p>
            <h1 className="display mt-6 text-5xl md:text-7xl">
              Lay them on<br /><span className="italic">the table.</span>
            </h1>
          </div>
          <p className="md:col-span-4 text-muted-foreground leading-relaxed">
            Drop in 30–120 photographs. We'll sequence them like a magazine — by light, by colour, by
            rhythm. You'll review every spread before anything is printed.
          </p>
        </div>
      </section>

      <section className="container-edit pb-16">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            onFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-sm transition-all duration-700 overflow-hidden ${
            drag ? "bg-beige" : "bg-stone-warm/60"
          }`}
          style={{ minHeight: "62vh" }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />

          {/* Paper grain */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #000 1px, transparent 1px), radial-gradient(circle at 70% 60%, #000 1px, transparent 1px)", backgroundSize: "40px 40px, 60px 60px" }} />

          {photos.length === 0 ? (
            <div className="relative h-[62vh] flex flex-col items-center justify-center text-center px-6">
              <div className="w-px h-20 bg-foreground/40" />
              <p className="font-serif italic text-3xl md:text-4xl mt-8 max-w-md leading-snug">
                Drag your photographs here, or <span className="underline underline-offset-4">choose them from your library</span>.
              </p>
              <p className="eyebrow mt-8">JPEG · PNG · HEIC · up to 120 frames</p>
            </div>
          ) : (
            <div className="relative" style={{ height: "62vh" }}>
              {photos.map((p, i) => (
                <div
                  key={p.id}
                  className="absolute book-shadow bg-background p-2"
                  style={{
                    left: `${10 + ((i * 11) % 75)}%`,
                    top: `${8 + ((i * 17) % 65)}%`,
                    transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`,
                    width: "180px",
                    transition: "transform 600ms cubic-bezier(.2,.7,.2,1)",
                    zIndex: i,
                  }}
                >
                  <img src={p.url} alt="" className="w-full h-44 object-cover" />
                </div>
              ))}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <span className="eyebrow bg-background/80 backdrop-blur px-4 py-2">{photos.length} photographs on the table</span>
                <span className="eyebrow bg-background/80 backdrop-blur px-4 py-2">+ add more</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-border pt-10">
          <div className="max-w-md">
            <label className="eyebrow block mb-3">Title of your volume</label>
            <input
              defaultValue={state.title ?? state.destination?.name ?? ""}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Untitled · Autumn 2026"
              className="w-full bg-transparent border-b border-foreground/40 focus:border-foreground outline-none font-serif text-3xl pb-3"
            />
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => setPhotos([])} className="btn-ghost text-muted-foreground">
              Clear table
            </button>
            <button
              onClick={proceed}
              disabled={photos.length === 0}
              className={`btn-primary ${photos.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              Bind the book
            </button>
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
