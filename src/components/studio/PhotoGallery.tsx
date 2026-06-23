import { useCallback, useRef, useState } from "react";

type Photo = {
  id: string;
  storage_url: string;
  sort_order: number;
  width?: number | null;
  height?: number | null;
  file_size_bytes?: number | null;
  created_at: string;
};

type PhotoGalleryProps = {
  photos: Photo[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onRemove: (photo: Photo) => void;
  onReplace: (photo: Photo) => void;
  onReorder: (photoIds: string[]) => void;
  loading?: boolean;
};

export function PhotoGallery({
  photos,
  selected,
  onToggleSelect,
  onRemove,
  onReplace,
  onReorder,
  loading,
}: PhotoGalleryProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      setDragIndex(null);
      setOverIndex(null);
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (isNaN(fromIndex) || fromIndex === dropIndex) return;
      const reordered = [...photos];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(dropIndex, 0, moved);
      onReorder(reordered.map((p) => p.id));
    },
    [photos, onReorder],
  );

  const formatSize = (bytes?: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-stone-warm/60 animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif italic text-xl text-muted-foreground">No photographs yet. Add some above.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {photos.map((photo, index) => {
        const isSelected = selected.has(photo.id);
        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== null && overIndex !== dragIndex;

        return (
          <div
            key={photo.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
            className={`group relative aspect-[3/4] bg-stone-warm rounded-sm overflow-hidden transition-all duration-200 ${
              isDragging ? "opacity-30 scale-95" : ""
            } ${isOver ? "ring-2 ring-foreground scale-[1.02]" : ""} ${isSelected ? "ring-2 ring-foreground" : ""}`}
          >
            <img
              src={photo.storage_url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

            <button
              onClick={(e) => { e.stopPropagation(); onToggleSelect(photo.id); }}
              className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? "bg-foreground border-foreground" : "bg-background/80 border-foreground/40 hover:border-foreground"
              }`}
            >
              {isSelected && <span className="text-background text-xs font-bold">✓</span>}
            </button>

            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onReplace(photo); }}
                  className="text-[0.6rem] uppercase tracking-wider text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-sm transition-colors"
                >
                  Replace
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(photo); }}
                  className="text-[0.6rem] uppercase tracking-wider text-red-300 hover:text-red-200 bg-red-900/30 hover:bg-red-900/50 px-2 py-0.5 rounded-sm transition-colors ml-auto"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="absolute bottom-1 left-2 text-[0.55rem] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
              {photo.width && photo.height ? `${photo.width}×${photo.height}` : ""}
              {formatSize(photo.file_size_bytes) ? ` · ${formatSize(photo.file_size_bytes)}` : ""}
            </div>

            <div className="absolute top-2 right-2 text-[0.55rem] text-white/40">
              #{photo.sort_order + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
