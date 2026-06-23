import type { BookPreview } from "@/types/preview";

export type Asset = {
  id: string;
  book_id: string;
  order_id: string | null;
  asset_type: AssetType;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  dpi: number;
  version: number;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type AssetType = "print_pdf" | "cover_pdf" | "thumbnail" | "preview_image" | "export";

export type PrintDocument = {
  bookId: string;
  orderId?: string;
  edition: PrintEdition;
  pages: PrintPage[];
};

export type PrintEdition = {
  name: string;
  pageWidthPoints: number;
  pageHeightPoints: number;
  bleedPoints: number;
  safeMarginPoints: number;
};

export type PrintPage = {
  pageNumber: number;
  templateId: string;
  elements: PrintElement[];
};

export type PrintElement = {
  kind: "image" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl?: string;
  imageBytes?: ArrayBuffer;
  text?: string;
  fontName?: string;
  fontSize?: number;
  opacity?: number;
};

export type ProductionStatus =
  | "pending"
  | "preparing_files"
  | "print_ready"
  | "printing"
  | "quality_check"
  | "packaged"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Job = {
  id: string;
  type: JobType;
  status: JobStatus;
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  error_message: string | null;
  attempts: number;
  max_attempts: number;
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type JobType =
  | "generate_preview"
  | "generate_pdf"
  | "generate_cover"
  | "generate_thumbnail"
  | "optimize_images"
  | "prepare_print_files"
  | "upload_images"
  | "send_email"
  | "sync_order";

export type JobStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export type ShippingDetail = {
  id: string;
  order_id: string;
  courier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  label_url: string | null;
  manifest_url: string | null;
  weight_grams: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  package_count: number;
  shipped_at: string | null;
  estimated_delivery_at: string | null;
  delivered_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type NotificationEvent = {
  id: string;
  user_id: string | null;
  order_id: string | null;
  event_type: string;
  channel: string;
  subject: string | null;
  body: string | null;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};
