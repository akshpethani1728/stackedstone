import { config } from "@/config";

const allowed = new Set(["image/jpeg", "image/png", "image/heic", "image/heif"]);
const extAllowed = new Set([".jpg", ".jpeg", ".png", ".heic", ".heif"]);
const MAX_FILE_SIZE = config.limits.maxFileSizeMB * 1024 * 1024;
const MAX_PHOTOS = config.limits.maxPhotosPerBook;

export type FileValidation = {
  valid: boolean;
  error?: string;
};

export function validateFile(file: File): FileValidation {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowed.has(file.type) && !extAllowed.has(ext)) {
    return { valid: false, error: `${file.name} is not a supported image format. Accepted: JPG, PNG, HEIC` };
  }
  if (file.size > MAX_FILE_SIZE) {
    const mb = config.limits.maxFileSizeMB;
    return { valid: false, error: `${file.name} exceeds the ${mb} MB limit.` };
  }
  if (file.size === 0) {
    return { valid: false, error: `${file.name} is empty.` };
  }
  return { valid: true };
}

export function validateFiles(files: File[]): { valid: File[]; rejected: { file: File; reason: string }[] } {
  const valid: File[] = [];
  const rejected: { file: File; reason: string }[] = [];
  for (const f of files) {
    const r = validateFile(f);
    if (r.valid) valid.push(f);
    else rejected.push({ file: f, reason: r.error! });
  }
  return { valid, rejected };
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image"));
    };
    img.src = url;
  });
}

export function computeFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const buf = reader.result as ArrayBuffer;
      const hashBuf = await crypto.subtle.digest("SHA-256", buf);
      const hash = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      resolve(hash);
    };
    reader.onerror = () => reject(new Error("Failed to read file for hashing"));
    reader.readAsArrayBuffer(file);
  });
}

export function getStoragePath(userId: string, bookId: string, filename: string): string {
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  return `${userId}/${bookId}/original/${safe}`;
}

export function getPublicUrl(path: string): string {
  const { supabaseUrl } = config.env;
  return `${supabaseUrl}/storage/v1/object/public/book-images/${path}`;
}

export function checkRemainingCapacity(
  existingCount: number,
  newCount: number,
): { allowed: number; exceeded: boolean; message?: string } {
  const remaining = MAX_PHOTOS - existingCount;
  if (remaining <= 0) {
    return { allowed: 0, exceeded: true, message: `You've reached the maximum of ${MAX_PHOTOS} photos per book.` };
  }
  if (newCount > remaining) {
    return {
      allowed: remaining,
      exceeded: true,
      message: `Only ${remaining} more photo${remaining === 1 ? "" : "s"} can be added (max ${MAX_PHOTOS}).`,
    };
  }
  return { allowed: newCount, exceeded: false };
}
