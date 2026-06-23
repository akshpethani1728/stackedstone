import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type CatalogueMap = Record<string, string>;

const cache: Record<string, CatalogueMap | null> = {};

function useCatalogueLookup(table: string): CatalogueMap | null {
  const [map, setMap] = useState<CatalogueMap | null>(cache[table] ?? null);

  useEffect(() => {
    if (cache[table]) {
      setMap(cache[table]);
      return;
    }
    let cancelled = false;
    const supabase = getSupabaseClient();
    supabase
      .from(table)
      .select("id, slug")
      .then((result: { data: any; error: any }) => {
        const { data, error } = result as { data: { id: string; slug: string }[] | null; error: any };
        if (!error && data && !cancelled) {
          const m: CatalogueMap = {};
          for (const row of data) m[row.slug] = row.id;
          cache[table] = m;
          setMap(m);
        }
      });
    return () => { cancelled = true; };
  }, [table]);

  return map;
}

export function useEditionIds() {
  return useCatalogueLookup("book_editions");
}

export function useCoverIds() {
  return useCatalogueLookup("cover_designs");
}

export function useMaterialIds() {
  return useCatalogueLookup("book_materials");
}

export function usePaperIds() {
  return useCatalogueLookup("paper_types");
}

export function usePageCountIds() {
  return useCatalogueLookup("page_counts");
}

export function useDestinationIds() {
  const [map, setMap] = useState<CatalogueMap | null>(null);
  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase
      .from("destinations")
      .select("id, slug")
      .then((result: { data: any; error: any }) => {
        const { data, error } = result as { data: { id: string; slug: string }[] | null; error: any };
        if (!error && data) {
          const m: CatalogueMap = {};
          for (const row of data) m[row.slug] = row.id;
          setMap(m);
        }
      });
  }, []);
  return map;
}
