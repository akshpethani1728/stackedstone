import type { BookPreview } from "@/types/preview";
import { LayoutEngine } from "@/services/layout-engine";
import { PreviewService } from "@/services/preview.service";
import { UploadService } from "@/services/upload.service";
import { logger } from "@/lib/logger";

export const BookGenerator = {
  async generate(bookId: string, totalPages: number): Promise<BookPreview> {
    logger.info("BookGenerator", "Starting generation", { bookId, totalPages });

    await PreviewService.setGeneratingStatus(bookId);

    const photos = await UploadService.listPhotos(bookId);

    if (photos.length === 0) {
      throw new Error("Cannot generate preview: no photos uploaded");
    }

    const preview = LayoutEngine.generate({
      photos,
      totalPages,
      bookId,
    });

    await PreviewService.savePreview(bookId, preview);

    logger.info("BookGenerator", "Generation complete", {
      bookId,
      pages: preview.totalPages,
      photos: preview.photoCount,
    });

    return preview;
  },

  async regenerateIfNeeded(bookId: string, photoCount: number, totalPages: number): Promise<BookPreview | null> {
    const needs = await PreviewService.needsRegeneration(bookId, photoCount, totalPages);
    if (!needs) {
      return PreviewService.getPreview(bookId);
    }
    return BookGenerator.generate(bookId, totalPages);
  },

  async loadOrGenerate(bookId: string, totalPages: number): Promise<BookPreview> {
    const existing = await PreviewService.getPreview(bookId);
    if (existing) return existing;
    return BookGenerator.generate(bookId, totalPages);
  },

  async getPreview(bookId: string): Promise<BookPreview | null> {
    return PreviewService.getPreview(bookId);
  },
};
