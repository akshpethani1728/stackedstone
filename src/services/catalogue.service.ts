import {
  editions,
  coverCollections,
  coversFor,
  materials,
  papers,
  pageCounts,
  extraOptions,
} from "@/data";
import type { Edition, Cover, Material, Paper, PageCount } from "@/types";

export function getEditions(): Edition[] {
  return editions;
}

export function getCovers(destinationSlug?: string): Cover[] {
  return coversFor(destinationSlug);
}

export function getMaterials(): Material[] {
  return materials;
}

export function getPapers(): Paper[] {
  return papers;
}

export function getPageCounts(): PageCount[] {
  return pageCounts;
}

export { coverCollections, extraOptions };
