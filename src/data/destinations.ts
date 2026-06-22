import type { DestinationEntry } from "@/types/destination";
import bali from "@/assets/dest-bali.jpg";
import kashmir from "@/assets/dest-kashmir.jpg";
import goa from "@/assets/dest-goa.jpg";
import rajasthan from "@/assets/dest-rajasthan.jpg";
import kerala from "@/assets/dest-kerala.jpg";
import ladakh from "@/assets/dest-ladakh.jpg";
import iceland from "@/assets/book-iceland.jpg";
import kyoto from "@/assets/book-kyoto.jpg";
import morocco from "@/assets/book-morocco.jpg";
import shelf1 from "@/assets/shelf-1.jpg";
import shelf2 from "@/assets/shelf-2.jpg";
import bookOpen from "@/assets/book-open.jpg";
import bookStack from "@/assets/book-stack.jpg";

export const destinations: DestinationEntry[] = [
  {
    slug: "kashmir", name: "Kashmir", region: "Himalayas", country: "India", tagline: "Houseboats and slow water.", mood: "A valley that holds its breath each morning.",
    palette: { bg: "#eef0ea", ink: "#2a3326", accent: "#7a8a5f" }, hero: kashmir, cover: kashmir, gallery: [kashmir, ladakh, shelf1, bookOpen],
    story: [
      { eyebrow: "Arrival", title: "By water, by wood.", body: "The shikara cuts a thin line across Dal Lake. Cedar shutters open onto a still mirror. There is no hurry here — only weather." },
      { eyebrow: "Light", title: "Pale gold, late.", body: "Afternoon light arrives sideways through chinar leaves. Photographers learn to wait for it." },
    ], pairings: ["ladakh", "japan", "rajasthan"], season: "April – October", category: "Mountains",
  },
  {
    slug: "japan", name: "Japan", region: "Honshu", country: "Japan", tagline: "A study in stillness.", mood: "Walls of paper. A bell at dusk. The discipline of small gestures.",
    palette: { bg: "#f3eee7", ink: "#1d1c1a", accent: "#7c2d1e" }, hero: kyoto, cover: kyoto, gallery: [kyoto, shelf2, bookOpen, bookStack],
    story: [
      { eyebrow: "Kyoto", title: "Rituals, repeated.", body: "Bamboo, tatami, kettle. A morning that has been performed for a thousand years." },
      { eyebrow: "Detail", title: "The honesty of joinery.", body: "There are no nails. There is no shortcut. Everything fits because someone decided it would." },
    ], pairings: ["kashmir", "europe", "kerala"], season: "March – May · October – November", category: "Cities",
  },
  {
    slug: "goa", name: "Goa", region: "Konkan coast", country: "India", tagline: "Salt, palms, slow Sundays.", mood: "Faded Portuguese yellow. A rope hammock. The sound of nothing in particular.",
    palette: { bg: "#f6ecdc", ink: "#3a2418", accent: "#c97a3a" }, hero: goa, cover: goa, gallery: [goa, bali, kerala, shelf1],
    story: [
      { eyebrow: "Mornings", title: "Coffee on a tiled verandah.", body: "Bougainvillea, peeling paint, a chapel bell somewhere behind the trees." },
      { eyebrow: "Evenings", title: "The sea takes its time.", body: "A long flat horizon. Fishermen pulling nets in slow, practiced lines." },
    ], pairings: ["kerala", "bali", "rajasthan"], season: "November – February", category: "Coastline",
  },
  {
    slug: "rajasthan", name: "Rajasthan", region: "Pink City & beyond", country: "India", tagline: "Light through carved sandstone.", mood: "Pigment, dust, mirrored embroidery. Everything photographs itself.",
    palette: { bg: "#f5e1d4", ink: "#3f1b14", accent: "#a73a2c" }, hero: rajasthan, cover: rajasthan, gallery: [rajasthan, morocco, shelf2, bookStack],
    story: [
      { eyebrow: "Jaipur", title: "A city the colour of a setting sun.", body: "Carved jaalis throw lacework across the floor. Even the shade is decorated." },
      { eyebrow: "Desert", title: "Thar, at dusk.", body: "The dunes turn from amber to rose to slate in less than an hour." },
    ], pairings: ["morocco", "goa", "kashmir"], season: "October – March", category: "Deserts",
  },
  {
    slug: "bali", name: "Bali", region: "Ubud highlands", country: "Indonesia", tagline: "Terraces wrapped in fog.", mood: "Wet green, warm rain, frangipani on stone.",
    palette: { bg: "#e9eee2", ink: "#1f2a1d", accent: "#5d7a4a" }, hero: bali, cover: bali, gallery: [bali, kerala, goa, shelf1],
    story: [
      { eyebrow: "Ubud", title: "Mornings made of mist.", body: "Rice terraces appear and dissolve. A canang offering left on a step." },
      { eyebrow: "Coast", title: "Black sand, white surf.", body: "The island has two tempos — one for the hills, one for the water." },
    ], pairings: ["kerala", "goa", "japan"], season: "April – October", category: "Coastline",
  },
  {
    slug: "kerala", name: "Kerala", region: "Backwaters", country: "India", tagline: "A morning that lasts all day.", mood: "Coconut palm shadow. The slow knock of a wooden hull.",
    palette: { bg: "#eaf0e8", ink: "#1c2a23", accent: "#3f6b4d" }, hero: kerala, cover: kerala, gallery: [kerala, bali, goa, bookOpen],
    story: [
      { eyebrow: "Alleppey", title: "Houseboats, slow water.", body: "The backwaters move at the pace of a long conversation." },
      { eyebrow: "Hills", title: "Tea, fog, silence.", body: "Munnar in May. Wet leaves and the smell of cardamom." },
    ], pairings: ["goa", "bali", "kashmir"], season: "September – March", category: "Backwaters",
  },
  {
    slug: "ladakh", name: "Ladakh", region: "High Himalaya", country: "India", tagline: "Where the road simply stops.", mood: "Thin air, thick silence. A monastery painted onto a cliff.",
    palette: { bg: "#ecebe4", ink: "#22241d", accent: "#9c6b2f" }, hero: ladakh, cover: ladakh, gallery: [ladakh, kashmir, shelf2, bookStack],
    story: [
      { eyebrow: "Altitude", title: "The colour of distance.", body: "Mountains the colour of an old bruise. The road draws itself between them." },
      { eyebrow: "Monasteries", title: "Painted prayers.", body: "Walls of saffron and madder. Butter lamps that never quite go out." },
    ], pairings: ["kashmir", "japan", "rajasthan"], season: "June – September", category: "Mountains",
  },
  {
    slug: "europe", name: "Iceland", region: "North Atlantic", country: "Iceland", tagline: "Fog, fjord, fire.", mood: "Weather that arrives in chapters.",
    palette: { bg: "#e8ecee", ink: "#1a1f24", accent: "#3b5a6b" }, hero: iceland, cover: iceland, gallery: [iceland, shelf2, bookOpen, bookStack],
    story: [
      { eyebrow: "Coast", title: "Black beaches, white surf.", body: "Basalt columns standing in a row, like an organ left in the rain." },
      { eyebrow: "Interior", title: "Moss on lava.", body: "A landscape that hasn't decided yet whether to be land or weather." },
    ], pairings: ["japan", "kashmir", "ladakh"], season: "May – September", category: "Atlantic",
  },
  {
    slug: "morocco", name: "Morocco", region: "Marrakech to Atlas", country: "Morocco", tagline: "Clay, shadow, ochre.", mood: "Tile, leather, mint tea. A medina lit by lanterns.",
    palette: { bg: "#f3e3cd", ink: "#3a1f10", accent: "#b6532a" }, hero: morocco, cover: morocco, gallery: [morocco, rajasthan, shelf1, bookStack],
    story: [
      { eyebrow: "Medina", title: "A labyrinth, by design.", body: "Narrow lanes that fold back on themselves. Every corner is a small composition." },
      { eyebrow: "Atlas", title: "Earth-walled villages.", body: "Houses the same colour as the hill they were cut from." },
    ], pairings: ["rajasthan", "goa", "europe"], season: "October – April", category: "Deserts",
  },
];

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
