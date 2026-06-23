import { z } from "zod";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/tiff"] as const;

export const uploadSchema = z.object({
  book_id: z.string().uuid(),
  file: z.instanceof(File).refine(
    (f) => ALLOWED_MIME_TYPES.includes(f.type as typeof ALLOWED_MIME_TYPES[number]),
    "Unsupported file type. Allowed: JPEG, PNG, WebP, TIFF",
  ),
  sort_order: z.number().int().nonnegative().optional(),
});

export type UploadInput = z.infer<typeof uploadSchema>;
