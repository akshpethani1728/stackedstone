import type { AuditTimestamps } from "./common";
import type { DestinationCategory } from "./enums";

export interface Destination extends AuditTimestamps {
  id: string;
  slug: string;
  name: string;
  region: string;
  country: string;
  tagline: string;
  mood: string;
  palette_bg: string;
  palette_ink: string;
  palette_accent: string;
  hero_url: string;
  cover_url: string;
  season: string;
  category: DestinationCategory;
  published: boolean;
  sort_order: number;
  stories: DestinationStory[];
  gallery: string[];
  pairings: string[];
}

export interface DestinationStory {
  eyebrow: string;
  title: string;
  body: string;
}

export interface BookEdition extends AuditTimestamps {
  id: string;
  slug: string;
  name: string;
  pages_min: number;
  pages_max: number;
  size_label: string;
  base_price: number;
  ideal_for: string;
  photo_estimate_min: number;
  photo_estimate_max: number;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface CoverDesign extends AuditTimestamps {
  id: string;
  slug: string;
  name: string;
  mood: string;
  ink_color: string;
  panel_color: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface DestinationCoverDesign {
  destination_id: string;
  cover_design_id: string;
  sort_order: number;
}

export interface BookMaterial extends AuditTimestamps {
  id: string;
  slug: string;
  name: string;
  feel: string;
  description: string;
  price_delta: number;
  swatch_color: string;
  texture_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface PaperType extends AuditTimestamps {
  id: string;
  slug: string;
  name: string;
  weight: string;
  finish: string;
  best_for: string;
  price_delta: number;
  texture_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface PageCount extends AuditTimestamps {
  id: string;
  pages: number;
  label: string;
  recommended_min: number;
  recommended_max: number;
  ideal_for: string;
  price_delta: number;
  is_active: boolean;
  sort_order: number;
}
