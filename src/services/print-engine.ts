import { getEditionDimensions } from "@/lib/print/editions";
import { getTemplate } from "@/lib/templates";
import type { BookPreview } from "@/types/preview";
import type { PrintDocument, PrintPage, PrintElement } from "@/types/production";

type PhotoMeta = {
  id: string;
  storage_url: string;
  width?: number | null;
  height?: number | null;
};

type EngineInput = {
  bookId: string;
  editionSlug: string;
  preview: BookPreview;
  photos: PhotoMeta[];
};

export const PrintEngine = {
  build(input: EngineInput): PrintDocument {
    const { bookId, editionSlug, preview, photos } = input;
    const dims = getEditionDimensions(editionSlug);
    const photoMap = new Map(photos.map((p) => [p.id, p]));

    const pages: PrintPage[] = [];

    if (preview.coverPage) {
      pages.push(this.buildPage(preview.coverPage, dims, photoMap, true));
    }

    for (const lp of preview.interiorPages) {
      pages.push(this.buildPage(lp, dims, photoMap, false));
    }

    if (preview.closingPage) {
      pages.push(this.buildPage(preview.closingPage, dims, photoMap, false));
    }

    return {
      bookId,
      edition: {
        name: editionSlug,
        ...dims,
      },
      pages,
    };
  },

  buildPage(
    layout: { pageNumber: number; templateId: string; photoAssignments: { photoId: string; url: string; slotIndex: number }[] },
    dims: ReturnType<typeof getEditionDimensions>,
    photoMap: Map<string, PhotoMeta>,
    _isCover: boolean,
  ): PrintPage {
    const template = getTemplate(layout.templateId);
    const slots = template?.slots ?? 1;

    const safeW = dims.pageWidthPoints - dims.safeMarginPoints * 2;
    const safeH = dims.pageHeightPoints - dims.safeMarginPoints * 2;
    const ox = dims.safeMarginPoints;
    const oy = dims.safeMarginPoints;

    const elements: PrintElement[] = [];

    for (let i = 0; i < slots; i++) {
      const assignment = layout.photoAssignments.find((a) => a.slotIndex === i);
      const photoMeta = assignment ? photoMap.get(assignment.photoId) : undefined;

      const pos = this.slotPosition(i, slots, safeW, safeH);

      elements.push({
        kind: "image",
        x: ox + pos.x,
        y: oy + pos.y,
        width: pos.width,
        height: pos.height,
        imageUrl: assignment?.url,
      });
    }

    return {
      pageNumber: layout.pageNumber,
      templateId: layout.templateId,
      elements,
    };
  },

  slotPosition(index: number, total: number, safeW: number, safeH: number): { x: number; y: number; width: number; height: number } {
    const gap = 12;

    if (total === 1) {
      return { x: 0, y: 0, width: safeW, height: safeH };
    }

    if (total === 2) {
      if (safeW >= safeH) {
        const w = (safeW - gap) / 2;
        return { x: index * (w + gap), y: 0, width: w, height: safeH };
      }
      const h = (safeH - gap) / 2;
      return { x: 0, y: index * (h + gap), width: safeW, height: h };
    }

    if (total === 3) {
      const positions = [
        { x: 0, y: 0, width: safeW, height: safeH * 0.5 },
        { x: 0, y: safeH * 0.5 + gap / 2, width: (safeW - gap) / 2, height: safeH * 0.5 - gap / 2 },
        { x: (safeW + gap) / 2, y: safeH * 0.5 + gap / 2, width: (safeW - gap) / 2, height: safeH * 0.5 - gap / 2 },
      ];
      return positions[index] ?? { x: 0, y: 0, width: safeW / 2, height: safeH / 2 };
    }

    const cols = 2;
    const rows = Math.ceil(total / cols);
    const cw = (safeW - gap) / cols;
    const rh = (safeH - gap * (rows - 1)) / rows;
    const col = index % cols;
    const row = Math.floor(index / cols);
    return { x: col * (cw + gap), y: row * (rh + gap), width: cw, height: rh };
  },
};
