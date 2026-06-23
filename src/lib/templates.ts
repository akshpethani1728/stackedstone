export type Template = {
  id: string;
  name: string;
  slots: number;
  description: string;
};

export const TEMPLATES: Template[] = [
  { id: "cover",        name: "Cover",          slots: 1, description: "Title page with primary photo" },
  { id: "full",         name: "Full Page",      slots: 1, description: "Single photo, full bleed" },
  { id: "panorama",     name: "Panorama",       slots: 1, description: "Wide photo with letterbox" },
  { id: "story",        name: "Story",          slots: 1, description: "Photo with space for future caption" },
  { id: "two-portrait", name: "Two Portrait",   slots: 2, description: "Two portrait photos side by side" },
  { id: "two-landscape",name: "Two Landscape",  slots: 2, description: "Two landscape photos stacked" },
  { id: "split",        name: "Split",          slots: 2, description: "Two photos, equal split" },
  { id: "hero-small",   name: "Hero + Small",   slots: 2, description: "One large, one small photo" },
  { id: "three-grid",   name: "Three Grid",     slots: 3, description: "Three photos in a grid" },
  { id: "four-grid",    name: "Four Grid",      slots: 4, description: "Four photos in a grid" },
  { id: "closing",      name: "Closing",        slots: 1, description: "Final page" },
];

const TEMPLATE_MAP = new Map(TEMPLATES.map((t) => [t.id, t]));

export function getTemplate(id: string): Template | undefined {
  return TEMPLATE_MAP.get(id);
}

export function isInteriorTemplate(id: string): boolean {
  return id !== "cover" && id !== "closing";
}

export function templatesWithSlots(slots: number): Template[] {
  return TEMPLATES.filter((t) => t.slots === slots && isInteriorTemplate(t.id));
}
