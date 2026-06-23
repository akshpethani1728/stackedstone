import { useEffect, useRef, useState, useCallback } from "react";
import type { StudioState, Extras } from "@/types";
import { BookService } from "@/services/book.service";
import { AuthService } from "@/services/auth.service";

export type { Extras };

const CACHE_KEY = "stacked.studio.v2";
const BOOK_ID_KEY = "stacked.studio.activeBookId";

const emptyExtras: Extras = { giftWrap: false, giftMessage: "", storageBox: false, extraCopy: false };
const empty: StudioState = { photoCount: 0, photos: [], extras: emptyExtras };

function readCache(): StudioState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed, extras: { ...emptyExtras, ...(parsed.extras ?? {}) } };
  } catch {
    return empty;
  }
}

function writeCache(state: StudioState) {
  if (typeof window === "undefined") return;
  const { photos: _p, ...rest } = state;
  window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(rest));
}

function getActiveBookId(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(BOOK_ID_KEY);
}

function setActiveBookId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) {
    window.sessionStorage.setItem(BOOK_ID_KEY, id);
  } else {
    window.sessionStorage.removeItem(BOOK_ID_KEY);
  }
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useStudio() {
  const [state, setState] = useState<StudioState>(empty);
  const [bookId, setBookId] = useState<string | null>(getActiveBookId());
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const loaded = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const existingId = getActiveBookId();
    if (existingId) {
      BookService.getById(existingId).then((book: any) => {
        setBookId(book.id);
        const mapped = mapBookToState(book);
        setState(mapped);
        writeCache(mapped);
      }).catch(() => {
        const cached = readCache();
        setState(cached);
      });
    } else {
      const cached = readCache();
      if (cached.destination) setState(cached);
    }
  }, []);

  const scheduleSave = useCallback((next: StudioState) => {
    const bid = bookId ?? getActiveBookId();
    if (!bid) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        await BookService.update(bid, mapStateToUpdate(next));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 4000);
      }
    }, 800);
  }, [bookId]);

  const patch = useCallback((next: Partial<StudioState>) => {
    const base = readCache();
    const merged: StudioState = { ...base, ...next };
    writeCache(merged);
    setState(merged);
    scheduleSave(merged);
  }, [scheduleSave]);

  const createDraft = useCallback(async () => {
    const user = await AuthService.requireAuth();
    const book = await BookService.create(user.id);
    setActiveBookId(book.id);
    setBookId(book.id);
    const fresh: StudioState = { ...empty, bookId: book.id };
    writeCache(fresh);
    setState(fresh);
    return book.id;
  }, []);

  const loadDraft = useCallback(async (id: string) => {
    const book = await BookService.getById(id);
    setActiveBookId(book.id);
    setBookId(book.id);
    const mapped = mapBookToState(book);
    setState(mapped);
    writeCache(mapped);
  }, []);

  const reset = useCallback(() => {
    setActiveBookId(null);
    setBookId(null);
    writeCache(empty);
    setState(empty);
    setSaveStatus("idle");
  }, []);

  return { state, patch, reset, bookId, saveStatus, createDraft, loadDraft };
}

function mapBookToState(book: any): StudioState {
  return {
    bookId: book.id,
    destination: book.destination ? mapCatalogItem(book.destination) : undefined,
    edition: book.edition ? mapCatalogItem(book.edition) : undefined,
    cover: book.cover_design ? mapCatalogItem(book.cover_design) : undefined,
    material: book.material ? mapCatalogItem(book.material) : undefined,
    paper: book.paper_type ? mapCatalogItem(book.paper_type) : undefined,
    pageCount: book.page_count ? mapPageCount(book.page_count) : undefined,
    extras: {
      giftWrap: book.extras?.gift_wrap ?? false,
      giftMessage: book.extras?.gift_message ?? "",
      storageBox: book.extras?.storage_box ?? false,
      extraCopy: book.extras?.extra_copy ?? false,
    },
    photoCount: book.photo_count ?? 0,
    photos: [],
  };
}

function mapCatalogItem(item: any) {
  if (!item) return undefined;
  return { ...item };
}

function mapPageCount(item: any) {
  if (!item) return undefined;
  return {
    pages: item.pages,
    label: item.label,
    recommended: [item.recommended_min ?? 0, item.recommended_max ?? 0] as [number, number],
    ideal: item.ideal_for ?? "",
    priceDelta: item.price_delta ?? 0,
    slug: item.slug,
    ...item,
  };
}

function mapStateToUpdate(state: StudioState): Record<string, unknown> {
  const update: Record<string, unknown> = {};
  if (state.destination) update.destination_id = state.destination.id;
  else if (state.destination === null || state.destination === undefined) update.destination_id = null;
  if (state.edition) update.edition_id = state.edition.id;
  else update.edition_id = null;
  if (state.cover) update.cover_design_id = state.cover.id;
  else update.cover_design_id = null;
  if (state.material) update.material_id = state.material.id;
  else update.material_id = null;
  if (state.paper) update.paper_type_id = state.paper.id;
  else update.paper_type_id = null;
  if (state.pageCount) update.page_count_id = state.pageCount.id;
  else update.page_count_id = null;
  if (state.title) update.title = state.title;
  update.extras = {
    gift_wrap: state.extras.giftWrap,
    gift_message: state.extras.giftMessage,
    storage_box: state.extras.storageBox,
    extra_copy: state.extras.extraCopy,
  };
  return update;
}
