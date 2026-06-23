import type { SaveStatus } from "@/stores/studio";

export function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs backdrop-blur-md border transition-all duration-500 ${
        status === "saving"
          ? "bg-foreground/5 border-border text-muted-foreground"
          : status === "saved"
          ? "bg-green-500/10 border-green-500/30 text-green-700"
          : "bg-red-500/10 border-red-500/30 text-red-700"
      }`}>
        {status === "saving" && (
          <>
            <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            <span className="tracking-wider uppercase text-[0.6rem]">Saving</span>
          </>
        )}
        {status === "saved" && (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-current">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="tracking-wider uppercase text-[0.6rem]">Saved</span>
          </>
        )}
        {status === "error" && (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-current">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 4v2M6 8v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="tracking-wider uppercase text-[0.6rem]">Save failed</span>
          </>
        )}
      </div>
    </div>
  );
}
