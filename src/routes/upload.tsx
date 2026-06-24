import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { useStudio } from "@/stores/studio";
import { AuthService } from "@/services/auth.service";
import { UploadService } from "@/services/upload.service";
import { UploadDropzone } from "@/components/studio/UploadDropzone";
import { PhotoGallery } from "@/components/studio/PhotoGallery";
import { UploadProgress } from "@/components/studio/UploadProgress";
import { useUploadQueue } from "@/hooks/use-upload-queue";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Add your photographs — Stacked Stone" },
      { name: "description", content: "Lay your photographs on the studio table. We'll do the rest." },
    ],
  }),
  component: UploadPage,
});

type Photo = {
  id: string;
  storage_url: string;
  sort_order: number;
  width?: number | null;
  height?: number | null;
  file_size_bytes?: number | null;
  created_at: string;
};

function UploadPage() {
  const navigate = useNavigate();
  const { state, patch } = useStudio();
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string>("");
  const [replaceTarget, setReplaceTarget] = useState<Photo | null>(null);
  const [replaceLoading, setReplaceLoading] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const loadedRef = useRef(false);
  const bookId = state.bookId;

  useEffect(() => {
    AuthService.requireAuth().then((u) => setUserId(u.id)).catch(() => {});
  }, []);

  const queue = useUploadQueue(bookId ?? null);

  useEffect(() => {
    const completed = queue.files.filter((f) => f.status === "completed" && f.record);
    if (completed.length === 0) return;
    const newPhotos: Photo[] = completed.map((f) => ({
      id: f.record!.id,
      storage_url: f.storageUrl ?? f.record!.storage_url,
      sort_order: f.record!.sort_order,
      width: f.record!.width ?? f.width ?? null,
      height: f.record!.height ?? f.height ?? null,
        file_size_bytes: f.record!.file_size_bytes ?? null,
      created_at: f.record!.created_at,
    }));
    setExistingPhotos((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const trulyNew = newPhotos.filter((p) => !existingIds.has(p.id));
      if (trulyNew.length === 0) return prev;
      return [...prev, ...trulyNew].sort((a, b) => a.sort_order - b.sort_order);
    });
  }, [queue.files]);

  const pc = state.pageCount;
  const min = pc?.recommended[0] ?? 20;
  const max = pc?.recommended[1] ?? 120;
  const rec = pc ? Math.round((pc.recommended[0] + pc.recommended[1]) / 2) : 35;

  const loadPhotos = useCallback(async () => {
    if (!bookId) { setGalleryLoading(false); return; }
    try {
      const photos = await UploadService.listPhotos(bookId);
      setExistingPhotos(photos);
    } catch {
      setExistingPhotos([]);
    } finally {
      setGalleryLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadPhotos();
  }, [loadPhotos]);

  const handleAddFiles = useCallback(
    (files: FileList | File[]) => {
      if (!bookId) return;
      queue.addFiles(files, existingPhotos.length);
    },
    [bookId, queue, existingPhotos.length],
  );

  const handleRemove = useCallback(
    async (photo: Photo) => {
      if (!window.confirm("Remove this photograph?")) return;
      try {
        await UploadService.removePhoto(photo.id, photo.storage_url);
        setExistingPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        setSelected((prev) => { const next = new Set(prev); next.delete(photo.id); return next; });
      } catch (err: any) {
        alert(err?.message ?? "Failed to remove photo");
      }
    },
    [],
  );

  const handleReplaceClick = useCallback((photo: Photo) => {
    setReplaceTarget(photo);
    setTimeout(() => replaceInputRef.current?.click(), 50);
  }, []);

  const handleReplaceFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !replaceTarget || !bookId) return;
      setReplaceLoading(true);
      try {
        const result = await UploadService.replacePhoto(bookId, userId, replaceTarget.id, replaceTarget.storage_url, file);
        setExistingPhotos((prev) =>
          prev.map((p) =>
            p.id === replaceTarget.id
               ? { ...p, storage_url: result.storageUrl, width: result.width, height: result.height, file_size_bytes: result.record.file_size_bytes }
              : p,
          ),
        );
      } catch (err: any) {
        alert(err?.message ?? "Failed to replace photo");
      } finally {
        setReplaceLoading(false);
        setReplaceTarget(null);
        if (e.target) e.target.value = "";
      }
    },
    [replaceTarget, bookId, userId],
  );

  const handleReorder = useCallback(async (photoIds: string[]) => {
    try {
      await UploadService.reorderPhotos(photoIds);
      setExistingPhotos((prev) =>
        photoIds.map((id, i) => {
          const found = prev.find((p) => p.id === id);
          return found ? { ...found, sort_order: i } : undefined;
        }).filter(Boolean) as Photo[],
      );
    } catch {}
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const proceed = () => {
    patch({
      photoCount: existingPhotos.length || rec,
      title: state.title ?? state.destination?.name,
    });
    navigate({ to: "/preview" });
  };

  const totalPhotos = existingPhotos.length;
  const enough = totalPhotos >= min;

  if (!bookId) {
    return (
      <StudioShell current="/upload">
        <section className="container-edit pt-24 md:pt-28 pb-10 text-center">
          <h1 className="display text-3xl md:text-5xl mt-6">Start a draft first</h1>
          <p className="text-muted-foreground mt-4">Choose your destination and preferences before adding photographs.</p>
          <Link to="/destination" className="btn-primary mt-8 inline-block">Begin creating</Link>
        </section>
      </StudioShell>
    );
  }

  return (
    <StudioShell current="/upload">
      <section className="container-edit pt-24 md:pt-28 pb-10">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">Step Seven · The Photographs</p>
            <h1 className="display mt-6 text-5xl md:text-7xl">
              Lay them on<br /><span className="italic">the table.</span>
            </h1>
          </div>
          <div className="md:col-span-4 text-muted-foreground leading-relaxed">
            <p className="italic text-foreground/80">For your {pc?.pages ?? 48}-page volume</p>
            <div className="mt-4 grid grid-cols-3 gap-4 max-w-xs">
              <div>
                <p className="eyebrow">Recommended</p>
                <p className="font-serif text-3xl text-foreground mt-1">{rec}</p>
              </div>
              <div>
                <p className="eyebrow">Minimum</p>
                <p className="font-serif text-3xl text-foreground/80 mt-1">{min}</p>
              </div>
              <div>
                <p className="eyebrow">Uploaded</p>
                <p className="font-serif text-3xl text-foreground/80 mt-1">{totalPhotos}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-edit pb-6">
        <UploadDropzone
          onFiles={handleAddFiles}
          disabled={totalPhotos >= max}
          maxPhotos={max}
          currentCount={totalPhotos}
        />
      </section>

      {queue.stats.total > 0 && (
        <section className="container-edit pb-6">
          <UploadProgress
            stats={queue.stats}
            files={queue.files}
            isPaused={queue.isPaused}
            onPause={queue.pause}
            onResume={queue.resume}
            onRetryAll={queue.retryAll}
            onClearCompleted={queue.clearCompleted}
          />
        </section>
      )}

      <section className="container-edit pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl">
            Gallery <span className="text-muted-foreground">· {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}</span>
          </h2>
          {selected.size > 0 && (
            <button
              onClick={async () => {
                if (!window.confirm(`Remove ${selected.size} selected photo${selected.size !== 1 ? "s" : ""}?`)) return;
                for (const id of selected) {
                  const photo = existingPhotos.find((p) => p.id === id);
                  if (photo) {
                    try {
                      await UploadService.removePhoto(photo.id, photo.storage_url);
                    } catch {}
                  }
                }
                setExistingPhotos((prev) => prev.filter((p) => !selected.has(p.id)));
                setSelected(new Set());
              }}
              className="text-[0.6rem] uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
            >
              Remove selected ({selected.size})
            </button>
          )}
        </div>

        <input
          ref={replaceInputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif,.bmp,.tiff,.tif"
          className="hidden"
          onChange={handleReplaceFile}
        />

        <PhotoGallery
          photos={existingPhotos}
          selected={selected}
          onToggleSelect={toggleSelect}
          onRemove={handleRemove}
          onReplace={handleReplaceClick}
          onReorder={handleReorder}
          loading={galleryLoading}
        />

        {replaceLoading && (
          <div className="mt-4 text-sm text-muted-foreground italic">
            Replacing photograph...
          </div>
        )}
      </section>

      <section className="container-edit pb-16">
        <div className="flex flex-wrap items-end justify-between gap-8 border-t border-border pt-10">
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
            <Link to="/pages" className="btn-ghost text-muted-foreground">← Pages</Link>
            <button
              onClick={proceed}
              disabled={!enough}
              className={`btn-primary ${!enough ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {enough ? "Bind the book" : `Add ${min - totalPhotos} more`}
            </button>
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
