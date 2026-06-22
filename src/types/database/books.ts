import type { BookStatus } from "./enums";
import type { AuditTimestamps, SoftDeletable } from "./common";

export interface BookExtras {
  gift_wrap: boolean;
  gift_message: string;
  storage_box: boolean;
  extra_copy: boolean;
}

export interface PriceBreakdown {
  edition_price: number;
  material_delta: number;
  paper_delta: number;
  page_count_delta: number;
  extras: {
    total: number;
    items: { slug: string; name: string; price: number }[];
  };
}

export interface Book extends AuditTimestamps, SoftDeletable {
  id: string;
  user_id: string;
  destination_id: string | null;
  edition_id: string | null;
  cover_design_id: string | null;
  material_id: string | null;
  paper_type_id: string | null;
  page_count_id: string | null;
  title: string | null;
  status: BookStatus;
  extras: BookExtras;
  price_breakdown: PriceBreakdown | null;
  total_price: number | null;
  photo_count: number;
}

export interface BookPhoto extends AuditTimestamps {
  id: string;
  book_id: string;
  storage_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  width: number | null;
  height: number | null;
  file_size_bytes: number | null;
}
