import { useEffect, useState } from "react";
import { BookService } from "@/services/book.service";
import { AuthService } from "@/services/auth.service";

export function useDrafts() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const user = await AuthService.requireAuth();
        const [items, draftCount] = await Promise.all([
          BookService.getDraftsByUser(user.id),
          BookService.getDraftCount(user.id),
        ]);
        if (!cancelled) {
          setDrafts(items);
          setCount(draftCount);
        }
      } catch {
        if (!cancelled) setDrafts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { drafts, loading, count, refetch: () => { setLoading(true); /* re-trigger effect */ } };
}

export function useBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const user = await AuthService.requireAuth();
        const items = await BookService.getByUser(user.id);
        if (!cancelled) setBooks(items);
      } catch {
        if (!cancelled) setBooks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { books, loading };
}
