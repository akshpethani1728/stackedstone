import { destinations, getDestination } from "@/data";
import type { DestinationEntry } from "@/types/destination";

export type { DestinationEntry };

export function getAll(): DestinationEntry[] {
  return destinations;
}

export function getBySlug(slug: string): DestinationEntry | undefined {
  return getDestination(slug);
}

export function getCategories(): DestinationEntry["category"][] {
  const set = new Set(destinations.map((d) => d.category));
  return Array.from(set);
}
