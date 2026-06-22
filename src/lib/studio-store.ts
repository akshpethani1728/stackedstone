// Lightweight session-scoped store for the book creation flow.
// Survives navigation without needing a backend.
import { useEffect, useState } from "react";

export type Edition = {
  slug: "weekend" | "journey" | "collector";
  name: string;
  pages: string;
  size: string;
  price: number;
  description: string;
};

export type Destination = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
};

export type StudioState = {
  edition?: Edition;
  destination?: Destination;
  photoCount: number;
  title?: string;
};

const KEY = "stacked.studio.v1";

const empty: StudioState = { photoCount: 0 };

function read(): StudioState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

function write(state: StudioState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("studio:change"));
}

export function useStudio() {
  const [state, setState] = useState<StudioState>(empty);

  useEffect(() => {
    setState(read());
    const handler = () => setState(read());
    window.addEventListener("studio:change", handler);
    return () => window.removeEventListener("studio:change", handler);
  }, []);

  const patch = (next: Partial<StudioState>) => {
    const merged = { ...read(), ...next };
    write(merged);
    setState(merged);
  };

  const reset = () => {
    write(empty);
    setState(empty);
  };

  return { state, patch, reset };
}

export const editions: Edition[] = [
  {
    slug: "weekend",
    name: "Weekend Edition",
    pages: "60 pages",
    size: "8 × 10 in",
    price: 89,
    description: "A short volume for a single chapter — a weekend away, a quiet retreat.",
  },
  {
    slug: "journey",
    name: "Journey Edition",
    pages: "120 pages",
    size: "10 × 12 in",
    price: 149,
    description: "Our most loved edition. Room to breathe across two or three destinations.",
  },
  {
    slug: "collector",
    name: "Collector Edition",
    pages: "200 pages",
    size: "12 × 14 in",
    price: 249,
    description: "A monumental object. Numbered, slip-cased, made to outlive the shelf.",
  },
];
