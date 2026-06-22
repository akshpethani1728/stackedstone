import { useEffect, useState } from "react";
import type { StudioState, Extras } from "@/types";

export type { Extras };

const KEY = "stacked.studio.v2";

const emptyExtras: Extras = { giftWrap: false, giftMessage: "", storageBox: false, extraCopy: false };
const empty: StudioState = { photoCount: 0, photos: [], extras: emptyExtras };

function read(): StudioState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed, extras: { ...emptyExtras, ...(parsed.extras ?? {}) } };
  } catch {
    return empty;
  }
}

function write(state: StudioState) {
  if (typeof window === "undefined") return;
  const { photos: _p, ...rest } = state;
  window.sessionStorage.setItem(KEY, JSON.stringify(rest));
  window.dispatchEvent(new CustomEvent("studio:change"));
}

let memory: StudioState | null = null;

export function useStudio() {
  const [state, setState] = useState<StudioState>(empty);

  useEffect(() => {
    const initial = memory ?? read();
    memory = initial;
    setState(initial);
    const handler = () => setState({ ...(memory ?? read()) });
    window.addEventListener("studio:change", handler);
    return () => window.removeEventListener("studio:change", handler);
  }, []);

  const patch = (next: Partial<StudioState>) => {
    const base = memory ?? read();
    const merged: StudioState = { ...base, ...next };
    memory = merged;
    write(merged);
    setState(merged);
  };

  const reset = () => {
    memory = empty;
    write(empty);
    setState(empty);
  };

  return { state, patch, reset };
}
