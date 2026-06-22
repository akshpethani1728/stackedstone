export type DestinationEntry = {
  slug: string;
  name: string;
  region: string;
  country: string;
  tagline: string;
  mood: string;
  palette: { bg: string; ink: string; accent: string };
  hero: string;
  cover: string;
  gallery: string[];
  story: { eyebrow: string; title: string; body: string }[];
  pairings: string[];
  season: string;
  category: "Coastline" | "Mountains" | "Cities" | "Deserts" | "Backwaters" | "Atlantic";
};
