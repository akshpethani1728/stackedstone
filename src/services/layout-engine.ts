import type { BookPreview, PageLayout, PhotoAssignment } from "@/types/preview";
import { TEMPLATES, getTemplate, isInteriorTemplate } from "@/lib/templates";

type Photo = {
  id: string;
  storage_url: string;
  sort_order: number;
  width?: number | null;
  height?: number | null;
};

type EngineInput = {
  photos: Photo[];
  totalPages: number;
  bookId: string;
};

export const LayoutEngine = {
  generate(input: EngineInput): BookPreview {
    const { photos, totalPages, bookId } = input;
    const sorted = [...photos].sort((a, b) => a.sort_order - b.sort_order);
    const interiorCount = Math.max(totalPages - 2, 1);
    const pool = [...sorted];

    const coverPhoto = pool.shift();
    const closingPhoto = pool.length > 0 ? pool.pop() : undefined;

    const coverPage = this.buildCoverPage(coverPhoto);
    const closingPage = this.buildClosingPage(closingPhoto);
    const interiorPages = this.buildInteriorPages(pool, interiorCount);

    return {
      bookId,
      totalPages,
      coverPage,
      interiorPages,
      closingPage,
      photoCount: sorted.length,
      generatedAt: new Date().toISOString(),
    };
  },

  regenerate(prev: BookPreview, photos: Photo[], totalPages: number): BookPreview {
    return this.generate({ photos, totalPages, bookId: prev.bookId });
  },

  buildCoverPage(photo?: Photo): PageLayout {
    return {
      pageNumber: 0,
      templateId: "cover",
      photoAssignments: photo
        ? [{ photoId: photo.id, url: photo.storage_url, slotIndex: 0 }]
        : [],
    };
  },

  buildClosingPage(photo?: Photo): PageLayout {
    return {
      pageNumber: -1,
      templateId: "closing",
      photoAssignments: photo
        ? [{ photoId: photo.id, url: photo.storage_url, slotIndex: 0 }]
        : [],
    };
  },

  buildInteriorPages(pool: Photo[], pageCount: number): PageLayout[] {
    if (pageCount <= 0 || pool.length === 0) {
      return this.fillEmptyPages(pageCount);
    }

    const pages: PageLayout[] = [];
    const history: string[] = [];
    let remaining = [...pool];

    for (let i = 0; i < pageCount; i++) {
      const remainingPages = pageCount - i;
      const photosLeft = remaining.length;
      const ideal = photosLeft / Math.max(remainingPages, 1);
      const templateId = this.pickTemplate(ideal, history, i, pageCount);
      const template = getTemplate(templateId);
      const slots = template?.slots ?? 1;

      history.push(templateId);
      if (history.length > 3) history.shift();

      const assigned = remaining.splice(0, slots);
      const assignments: PhotoAssignment[] = assigned.map((p, si) => ({
        photoId: p.id,
        url: p.storage_url,
        slotIndex: si,
      }));

      pages.push({
        pageNumber: i + 1,
        templateId,
        photoAssignments: assignments,
      });
    }

    return pages;
  },

  fillEmptyPages(count: number): PageLayout[] {
    return Array.from({ length: count }, (_, i) => ({
      pageNumber: i + 1,
      templateId: "story",
      photoAssignments: [],
    }));
  },

  pickTemplate(ideal: number, history: string[], pageIndex: number, totalPages: number): string {
    const interior = TEMPLATES.filter((t) => isInteriorTemplate(t.id));
    const progress = pageIndex / totalPages;

    const scored = interior
      .map((t) => {
        let score = 0;
        const diff = Math.abs(t.slots - ideal);
        score += diff === 0 ? 100 : diff === 1 ? 60 : Math.max(0, 30 - diff * 10);

        if (progress < 0.3) {
          score += t.slots >= 3 ? 20 : t.slots >= 2 ? 10 : 0;
        } else if (progress > 0.7) {
          score += t.slots <= 1 ? 15 : t.slots === 2 ? 5 : 0;
        }

        if (history.includes(t.id)) {
          score -= history.lastIndexOf(t.id) === history.length - 1 ? 40 : 20;
        }

        return { id: t.id, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored[0]?.id ?? "full";
  },
};
