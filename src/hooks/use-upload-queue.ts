import { useCallback, useEffect, useRef, useState } from "react";
import { UploadService } from "@/services/upload.service";
import { AuthService } from "@/services/auth.service";
import { validateFiles, checkRemainingCapacity } from "@/lib/upload-utils";
import { fromSupabaseError } from "@/lib/errors";

export type UploadTask = {
  id: string;
  file: File;
  status: "pending" | "uploading" | "completed" | "failed";
  progress: number;
  error?: string;
  record?: any;
  width?: number;
  height?: number;
  storageUrl?: string;
};

export type UploadStats = {
  total: number;
  completed: number;
  failed: number;
  uploading: number;
  pending: number;
  overallProgress: number;
};

const CONCURRENCY = 4;
const MAX_RETRIES = 2;

export function useUploadQueue(bookId: string | null) {
  const [files, setFiles] = useState<UploadTask[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const pausedRef = useRef(false);
  const mountedRef = useRef(true);
  const activeCount = useRef(0);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    AuthService.requireAuth().then((u) => { userIdRef.current = u.id; }).catch(() => {});
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => { pausedRef.current = isPaused; }, [isPaused]);

  const doUpload = useCallback(async (taskId: string, taskFile: File) => {
    const bid = bookId;
    const uid = userIdRef.current;
    if (!bid || !uid) { activeCount.current--; return; }

    let retries = 0;
    const attempt = async (): Promise<void> => {
      try {
        const result = await UploadService.uploadFile(bid, uid, taskFile, (pct) => {
          if (!mountedRef.current) return;
          setFiles((prev) => prev.map((f) => (f.id === taskId ? { ...f, progress: pct } : f)));
        });
        if (mountedRef.current) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === taskId
                ? {
                    ...f,
                    status: "completed" as const,
                    progress: 100,
                    record: result.record,
                    width: result.width,
                    height: result.height,
                    storageUrl: result.storageUrl,
                  }
                : f,
            ),
          );
        }
      } catch (err: any) {
        const msg = err?.message ?? "";
        const isTransient =
          /network|timeout|abort|429|5\d{2}/i.test(msg);
        if (isTransient && retries < MAX_RETRIES && mountedRef.current) {
          retries++;
          await new Promise((r) => setTimeout(r, 1000 * retries));
          return attempt();
        }
        if (mountedRef.current) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === taskId
                ? { ...f, status: "failed" as const, error: fromSupabaseError(err).message }
                : f,
            ),
          );
        }
      }
    };

    await attempt();
    activeCount.current--;
  }, [bookId]);

  const processQueue = useCallback(() => {
    if (pausedRef.current || !bookId || !userIdRef.current) return;
    if (activeCount.current >= CONCURRENCY) return;

    setFiles((prev) => {
      const pending = prev.find((f) => f.status === "pending");
      if (!pending) return prev;

      activeCount.current++;
      doUpload(pending.id, pending.file);

      return prev.map((f) => (f.id === pending.id ? { ...f, status: "uploading" as const, progress: 0 } : f));
    });
  }, [bookId, doUpload]);

  useEffect(() => { processQueue(); }, [processQueue, files]);

  const addFiles = useCallback(
    (newFiles: FileList | File[], existingCount?: number) => {
      const fileArray = Array.from(newFiles);
      const { valid, rejected } = validateFiles(fileArray);
      const capacity = checkRemainingCapacity(existingCount ?? 0, valid.length);
      const allowedFiles = capacity.exceeded ? valid.slice(0, capacity.allowed) : valid;
      const tasks: UploadTask[] = allowedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        status: "pending" as const,
        progress: 0,
      }));
      setFiles((prev) => [...prev, ...tasks]);
      if (capacity.exceeded && capacity.message) {
        return { added: allowedFiles.length, rejected, message: capacity.message };
      }
      return { added: allowedFiles.length, rejected };
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const retry = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id && f.status === "failed" ? { ...f, status: "pending" as const, progress: 0, error: undefined } : f)),
    );
  }, []);

  const retryAll = useCallback(() => {
    setFiles((prev) =>
      prev.map((f) => (f.status === "failed" ? { ...f, status: "pending" as const, progress: 0, error: undefined } : f)),
    );
  }, []);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== "completed"));
  }, []);

  const stats: UploadStats = (() => {
    if (files.length === 0) return { total: 0, completed: 0, failed: 0, uploading: 0, pending: 0, overallProgress: 0 };
    const total = files.length;
    const completed = files.filter((f) => f.status === "completed").length;
    const failed = files.filter((f) => f.status === "failed").length;
    const uploading = files.filter((f) => f.status === "uploading").length;
    const pending = files.filter((f) => f.status === "pending").length;
    const totalProgress = files.reduce((s, f) => s + f.progress, 0);
    const overallProgress = Math.round(totalProgress / total);
    return { total, completed, failed, uploading, pending, overallProgress };
  })();

  return {
    files,
    stats,
    isPaused,
    addFiles,
    remove,
    retry,
    retryAll,
    pause,
    resume,
    clearCompleted,
  };
}
