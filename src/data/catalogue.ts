import type { Cover, Edition, Extras, Material, PageCount, Paper } from "@/types";
import bali from "@/assets/dest-bali.jpg";
import kashmir from "@/assets/dest-kashmir.jpg";
import goa from "@/assets/dest-goa.jpg";
import rajasthan from "@/assets/dest-rajasthan.jpg";
import kerala from "@/assets/dest-kerala.jpg";
import ladakh from "@/assets/dest-ladakh.jpg";
import iceland from "@/assets/book-iceland.jpg";
import kyoto from "@/assets/book-kyoto.jpg";
import morocco from "@/assets/book-morocco.jpg";
import craftPaper from "@/assets/craft-paper.jpg";
import shelf1 from "@/assets/shelf-1.jpg";
import shelf2 from "@/assets/shelf-2.jpg";

export const editions: Edition[] = [
  { slug: "weekend", name: "Weekend Edition", pages: "24–36 pages", size: "8 × 10 in", price: 4990, ideal: "A single chapter — a weekend, a wedding, a quiet retreat.", photoEstimate: "20–45 photographs", description: "Slim, deliberate. A volume that reads like a long postcard." },
  { slug: "journey", name: "Journey Edition", pages: "48–72 pages", size: "10 × 12 in", price: 7990, ideal: "A single trip across a country or coastline.", photoEstimate: "45–80 photographs", description: "Our most loved edition — room to breathe, weight to hold." },
  { slug: "explorer", name: "Explorer Edition", pages: "72–120 pages", size: "11 × 13 in", price: 10990, ideal: "A season abroad. Two or three destinations woven together.", photoEstimate: "70–110 photographs", description: "Generous. The kind of book a guest opens uninvited." },
  { slug: "collector", name: "Collector's Edition", pages: "120–200 pages", size: "12 × 14 in", price: 14990, ideal: "A year, a body of work, a quiet monument.", photoEstimate: "100–160 photographs", description: "Numbered, slip-cased, made to outlive the shelf." },
];

const coverArt: Record<string, string> = {
  bali, kashmir, goa, rajasthan, kerala, ladakh, iceland, kyoto, morocco,
  europe: iceland, japan: kyoto, shelf1, shelf2,
};

export const coverCollections: Record<string, Cover[]> = {
  goa: [
    { slug: "minimal-sand",  name: "Minimal Sand",  mood: "Faded yellow, late verandah",  ink: "#3a2418", panel: "rgba(246,236,220,0.78)", image: goa },
    { slug: "coastal-blue",  name: "Coastal Blue",  mood: "Indigo dusk on the Arabian Sea", ink: "#f6ecdc", panel: "rgba(20,40,55,0.55)", image: kerala },
    { slug: "palm-edition",  name: "Palm Edition",  mood: "Shadow of palms on tile",        ink: "#1d2a1d", panel: "rgba(232,238,222,0.7)",  image: bali },
    { slug: "sunset",        name: "Sunset Edition", mood: "Last light on the Konkan coast", ink: "#f6ecdc", panel: "rgba(160,60,30,0.55)",  image: rajasthan },
  ],
  japan: [
    { slug: "sakura",        name: "Sakura",         mood: "Pale pink, a single petal",       ink: "#3a1318", panel: "rgba(245,220,225,0.75)", image: kyoto },
    { slug: "kyoto-stone",   name: "Kyoto Stone",    mood: "Wet temple stone at dawn",        ink: "#f3eee7", panel: "rgba(30,28,26,0.55)",     image: kyoto },
    { slug: "tokyo-night",   name: "Tokyo Night",    mood: "Neon over rain",                  ink: "#f3eee7", panel: "rgba(10,12,18,0.6)",      image: iceland },
    { slug: "minimal-white", name: "Minimal White",  mood: "Paper, ink, restraint",           ink: "#1d1c1a", panel: "rgba(248,244,238,0.85)",  image: shelf2 },
  ],
  kashmir: [
    { slug: "valley-mist",   name: "Valley Mist",    mood: "Cedar and slow water",            ink: "#f2f1ea", panel: "rgba(42,51,38,0.55)",     image: kashmir },
    { slug: "cedar",         name: "Cedar",          mood: "A houseboat at first light",      ink: "#2a3326", panel: "rgba(238,240,234,0.75)",  image: ladakh },
    { slug: "shikara",       name: "Shikara",        mood: "Reflection on Dal Lake",          ink: "#1c2a23", panel: "rgba(220,228,214,0.7)",   image: kashmir },
    { slug: "saffron",       name: "Saffron",        mood: "Late autumn in the chinar grove", ink: "#f6ecdc", panel: "rgba(120,75,30,0.55)",    image: morocco },
  ],
  rajasthan: [
    { slug: "pink-city",     name: "Pink City",      mood: "Carved sandstone, late sun",      ink: "#3f1b14", panel: "rgba(245,225,212,0.75)",  image: rajasthan },
    { slug: "thar-dusk",     name: "Thar Dusk",      mood: "Dune, slate, ochre",              ink: "#f5e1d4", panel: "rgba(60,20,12,0.55)",     image: morocco },
    { slug: "haveli",        name: "Haveli",         mood: "Lacework shadow on cool stone",   ink: "#3f1b14", panel: "rgba(245,225,212,0.6)",   image: rajasthan },
    { slug: "marigold",      name: "Marigold",       mood: "A garland against painted wall",  ink: "#f5e1d4", panel: "rgba(180,80,40,0.6)",     image: goa },
  ],
  bali: [
    { slug: "ubud-mist",     name: "Ubud Mist",      mood: "Terraces wrapped in fog",         ink: "#1f2a1d", panel: "rgba(233,238,226,0.78)",  image: bali },
    { slug: "black-sand",    name: "Black Sand",     mood: "Wet basalt, white surf",          ink: "#e9eee2", panel: "rgba(20,24,22,0.6)",      image: iceland },
    { slug: "frangipani",    name: "Frangipani",     mood: "Stone steps, a quiet offering",   ink: "#1f2a1d", panel: "rgba(233,238,226,0.65)",  image: kerala },
    { slug: "rice-paper",    name: "Rice Paper",     mood: "Soft white, restraint",           ink: "#1f2a1d", panel: "rgba(250,247,240,0.85)",  image: shelf1 },
  ],
  kerala: [
    { slug: "backwater",     name: "Backwater",      mood: "A slow knock of wooden hull",     ink: "#f0f5ec", panel: "rgba(28,42,35,0.55)",     image: kerala },
    { slug: "tea-fog",       name: "Tea & Fog",      mood: "Munnar in May",                   ink: "#1c2a23", panel: "rgba(234,240,232,0.8)",   image: bali },
    { slug: "alleppey",      name: "Alleppey",       mood: "Houseboat at first light",        ink: "#f0f5ec", panel: "rgba(45,75,55,0.55)",     image: kerala },
    { slug: "cardamom",      name: "Cardamom",       mood: "Wet leaves, slow light",          ink: "#1c2a23", panel: "rgba(234,240,232,0.65)",  image: goa },
  ],
  ladakh: [
    { slug: "high-road",     name: "High Road",      mood: "Where the road simply stops",     ink: "#f0eee5", panel: "rgba(34,36,29,0.6)",       image: ladakh },
    { slug: "monastery",     name: "Monastery",      mood: "Saffron walls, butter lamps",     ink: "#22241d", panel: "rgba(236,235,228,0.75)",  image: ladakh },
    { slug: "pangong",       name: "Pangong",        mood: "Blue beyond believing",           ink: "#f0eee5", panel: "rgba(40,70,90,0.55)",      image: iceland },
    { slug: "stone-altar",   name: "Stone Altar",    mood: "Painted prayer on a cliff",       ink: "#22241d", panel: "rgba(236,235,228,0.6)",    image: kashmir },
  ],
  europe: [
    { slug: "north-atlantic",name: "North Atlantic", mood: "Fog, fjord, fire",                ink: "#e8ecee", panel: "rgba(26,31,36,0.6)",       image: iceland },
    { slug: "basalt",        name: "Basalt",         mood: "Black columns in white surf",     ink: "#e8ecee", panel: "rgba(15,18,22,0.65)",      image: iceland },
    { slug: "moss",          name: "Moss",           mood: "Moss on cooled lava",             ink: "#1a1f24", panel: "rgba(220,228,220,0.78)",   image: bali },
    { slug: "fjord-paper",   name: "Fjord Paper",    mood: "Pale grey, restraint",            ink: "#1a1f24", panel: "rgba(244,246,248,0.85)",   image: shelf2 },
  ],
  morocco: [
    { slug: "medina",        name: "Medina",         mood: "Lantern-lit labyrinth",           ink: "#f3e3cd", panel: "rgba(58,31,16,0.6)",       image: morocco },
    { slug: "atlas-clay",    name: "Atlas Clay",     mood: "Earth walls the colour of hill",  ink: "#3a1f10", panel: "rgba(243,227,205,0.78)",   image: morocco },
    { slug: "tile",          name: "Tile",           mood: "Cobalt and bone, repeated",       ink: "#f3e3cd", panel: "rgba(30,60,90,0.6)",       image: iceland },
    { slug: "ochre",         name: "Ochre",          mood: "A wall in late afternoon",        ink: "#3a1f10", panel: "rgba(220,165,90,0.65)",    image: rajasthan },
  ],
};

export function coversFor(slug?: string): Cover[] {
  if (!slug) return [];
  return coverCollections[slug] ?? [
    { slug: "minimal",   name: "Minimal",      mood: "Paper, ink, restraint",  ink: "#1d1c1a", panel: "rgba(248,244,238,0.85)", image: coverArt[slug] ?? shelf1 },
    { slug: "editorial", name: "Editorial",    mood: "Photographic, full bleed", ink: "#f6ecdc", panel: "rgba(20,18,16,0.5)",     image: coverArt[slug] ?? shelf2 },
    { slug: "panel",     name: "Panel",        mood: "Half image, half quiet",  ink: "#1d1c1a", panel: "rgba(238,232,220,0.85)", image: coverArt[slug] ?? shelf1 },
  ];
}

export const materials: Material[] = [
  { slug: "classic", name: "Classic Hardcover", feel: "Smooth, slightly cool to the touch.", description: "Cloth-wrapped board with a matte print finish. Quiet, archival, dependable.", priceDelta: 0, swatch: "#e7e2d6", texture: shelf1 },
  { slug: "linen", name: "Linen Bound", feel: "Open weave, gentle texture under the thumb.", description: "European linen wrapped over rigid board, debossed by hand for the title and spine.", priceDelta: 1490, swatch: "#c7bca6", texture: craftPaper },
  { slug: "matte", name: "Premium Matte", feel: "Velvety, almost chalky.", description: "A fine matte lamination across photographic board. Resists glare, holds shadow.", priceDelta: 990, swatch: "#3a3530", texture: shelf2 },
  { slug: "soft-touch", name: "Soft Touch", feel: "Suede-like. A surprise the first time.", description: "An extraordinary tactile coating that softens light and invites a second look.", priceDelta: 1690, swatch: "#1f1d1b", texture: shelf1 },
];

export const papers: Paper[] = [
  { slug: "premium-matte", name: "Premium Matte", weight: "170 gsm", finish: "Smooth, low-glare", bestFor: "Honest light, candid portraits.", priceDelta: 0, texture: craftPaper },
  { slug: "silk", name: "Silk", weight: "200 gsm", finish: "Subtle satin sheen", bestFor: "Architecture, interiors, the long horizon.", priceDelta: 790, texture: shelf2 },
  { slug: "lustre", name: "Lustre", weight: "230 gsm", finish: "Deep blacks, gentle gloss", bestFor: "Nightscapes, food, anything you want to hold.", priceDelta: 1290, texture: shelf1 },
  { slug: "fine-art", name: "Fine Art Cotton", weight: "270 gsm cotton", finish: "Uncoated, museum-grade", bestFor: "Black & white, fine grain, archival commissions.", priceDelta: 1990, texture: craftPaper },
];

export const pageCounts: PageCount[] = [
  { pages: 24, label: "24 pages", recommended: [20, 35], ideal: "A weekend, a short story.",            priceDelta: 0 },
  { pages: 36, label: "36 pages", recommended: [30, 55], ideal: "A long trip, a single place.",         priceDelta: 790 },
  { pages: 48, label: "48 pages", recommended: [45, 75], ideal: "A country, a season, a slow read.",    priceDelta: 1490 },
  { pages: 72, label: "72 pages", recommended: [70, 120], ideal: "A body of work — your most loved.",   priceDelta: 2490 },
];

export const extraOptions = [
  { slug: "giftWrap",    name: "Gift wrapping",        note: "Hand-tied muslin & wax seal.",          price: 690 },
  { slug: "storageBox",  name: "Premium storage box",  note: "Linen-clad slipcase, foam-lined.",      price: 1990 },
  { slug: "extraCopy",   name: "Extra copy",           note: "A second volume, same craft.",          price: 5990 },
] as const;

export type ExtraOption = (typeof extraOptions)[number];
