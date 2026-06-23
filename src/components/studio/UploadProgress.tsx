import type { UploadStats, UploadTask } from "@/hooks/use-upload-queue";

type UploadProgressProps = {
  stats: UploadStats;
  files: UploadTask[];
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onRetryAll: () => void;
  onClearCompleted: () => void;
};

export function UploadProgress({
  stats,
  files,
  isPaused,
  onPause,
  onResume,
  onRetryAll,
  onClearCompleted,
}: UploadProgressProps) {
  const hasActive = stats.uploading > 0;
  const hasPending = stats.pending > 0;
  const hasFailed = stats.failed > 0;
  const hasCompleted = stats.completed > 0;
  const isWorking = hasActive || hasPending;

  if (stats.total === 0) return null;

  const progressColor =
    stats.failed > 0 && stats.completed === 0
      ? "bg-red-500"
      : stats.failed > 0
        ? "bg-amber-500"
        : stats.overallProgress === 100
          ? "bg-green-500"
          : "bg-foreground";

  return (
    <div className="bg-stone-warm/80 border border-border/60 rounded-sm p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="h-1.5 flex-1 min-w-[120px] bg-border/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${stats.overallProgress}%` }}
            />
          </div>
          <span className="eyebrow whitespace-nowrap">{stats.overallProgress}%</span>
        </div>

        <div className="flex items-center gap-4 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
          <span>{stats.completed} / {stats.total} uploaded</span>
          {hasFailed && <span className="text-red-500">{stats.failed} failed</span>}
          {hasActive && <span className="text-foreground">{stats.uploading} uploading</span>}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-1 max-h-[120px] overflow-y-auto">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-2 text-[0.65rem] text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                f.status === "completed" ? "bg-green-500" :
                f.status === "failed" ? "bg-red-500" :
                f.status === "uploading" ? "bg-foreground animate-pulse" :
                "bg-muted-foreground/40"
              }`} />
              <span className="truncate max-w-[200px]">{f.file.name}</span>
              <span className="ml-auto shrink-0">
                {f.status === "completed" && "✓"}
                {f.status === "failed" && (f.error ?? "Error")}
                {f.status === "uploading" && `${f.progress}%`}
                {f.status === "pending" && "waiting"}
              </span>
            </div>
          ))}
        </div>
      )}

      {(isWorking || hasFailed || hasCompleted) && (
        <div className="flex items-center gap-3 pt-1 border-t border-border/40">
          {isWorking && (
            <button
              onClick={isPaused ? onResume : onPause}
              className="text-[0.6rem] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}
          {hasFailed && (
            <button
              onClick={onRetryAll}
              className="text-[0.6rem] uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
            >
              Retry all
            </button>
          )}
          {hasCompleted && !isWorking && (
            <button
              onClick={onClearCompleted}
              className="text-[0.6rem] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}
