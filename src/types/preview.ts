export type PhotoAssignment = {
  photoId: string;
  url: string;
  slotIndex: number;
};

export type PageLayout = {
  pageNumber: number;
  templateId: string;
  photoAssignments: PhotoAssignment[];
};

export type BookPreview = {
  bookId: string;
  totalPages: number;
  coverPage: PageLayout;
  interiorPages: PageLayout[];
  closingPage: PageLayout;
  photoCount: number;
  generatedAt: string;
};

export type GenerationStatus = "idle" | "generating" | "ready" | "error";
