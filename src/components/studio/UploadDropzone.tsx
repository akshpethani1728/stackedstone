import { useRef, useState, useCallback } from "react";

type UploadDropzoneProps = {
  onFiles: (files: FileList | File[]) => void;
  disabled?: boolean;
  maxPhotos?: number;
  currentCount?: number;
};

export function UploadDropzone({ onFiles, disabled, maxPhotos = 150, currentCount = 0 }: UploadDropzoneProps) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      if (disabled) return;
      if (e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files);
      }
    },
    [disabled, onFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFiles(e.target.files);
        e.target.value = "";
      }
    },
    [onFiles],
  );

  const remaining = maxPhotos - currentCount;

  return (
    <div
      onDragOver={(e) => { if (!disabled) { e.preventDefault(); setDrag(true); } }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-sm border-2 border-dashed transition-all duration-500 overflow-hidden ${
        disabled ? "opacity-30 cursor-not-allowed" : ""
      } ${drag ? "border-foreground bg-beige" : "border-border/60 bg-stone-warm/60 hover:border-foreground/40"}`}
      style={{ minHeight: "28vh" }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
        multiple
        className="hidden"
        onChange={handleChange}
        {...({ webkitdirectory: "" } as any)}
      />

      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #000 1px, transparent 1px), radial-gradient(circle at 70% 60%, #000 1px, transparent 1px)", backgroundSize: "40px 40px, 60px 60px" }} />

      <div className="relative h-[28vh] flex flex-col items-center justify-center text-center px-6">
        <div className={`w-px h-12 ${drag ? "bg-foreground" : "bg-foreground/40"} transition-colors`} />
        <p className="font-serif italic text-xl md:text-2xl mt-6 max-w-lg leading-snug text-foreground/80">
          {disabled
            ? "Maximum photos reached"
            : drag
              ? "Drop your photographs here"
              : "Drag photographs here, or click to choose"}
        </p>
        <p className="eyebrow mt-6 text-muted-foreground">
          {disabled
            ? `${maxPhotos} photo limit`
            : `JPEG · PNG · HEIC · ${remaining} of ${maxPhotos} remaining`}
        </p>
      </div>
    </div>
  );
}
