import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BookPreview, PageLayout } from "@/types/preview";
import { PreviewPage } from "@/components/studio/PreviewPage";

type Props = {
  preview: BookPreview;
  coverUrl?: string;
};

export function BookPreview({ preview, coverUrl }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [spreadView, setSpreadView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const allPages = useMemo(() => {
    const pages: { layout: PageLayout; displayNumber: number }[] = [];

    pages.push({
      layout: preview.coverPage,
      displayNumber: 0,
    });

    preview.interiorPages.forEach((p) => {
      pages.push({
        layout: p,
        displayNumber: p.pageNumber,
      });
    });

    pages.push({
      layout: preview.closingPage,
      displayNumber: preview.totalPages + 1,
    });

    return pages;
  }, [preview]);

  const totalDisplay = allPages.length;
  const maxPage = spreadView ? totalDisplay - 2 : totalDisplay - 1;
  const safePage = Math.min(currentPage, Math.max(0, maxPage));

  useEffect(() => {
    setCurrentPage(0);
  }, [preview]);

  const goNext = useCallback(() => {
    setCurrentPage((p) => Math.min(p + (spreadView ? 2 : 1), maxPage));
  }, [maxPage, spreadView]);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => Math.max(p - (spreadView ? 2 : 1), 0));
  }, [spreadView]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    },
    [goNext, goPrev],
  );

  const leftPage = safePage < totalDisplay ? allPages[safePage] : null;
  const rightPage = spreadView && safePage + 1 < totalDisplay ? allPages[safePage + 1] : null;
  const displayLabel = spreadView
    ? `${safePage + 1}–${Math.min(safePage + 2, totalDisplay)} of ${totalDisplay}`
    : `${safePage + 1} of ${totalDisplay}`;

  const thumbnails = useMemo(
    () => allPages.filter((_, i) => {
      if (spreadView) return i % 2 === 0;
      return true;
    }),
    [allPages, spreadView],
  );

  return (
    <div className="select-none" onKeyDown={handleKeyDown} tabIndex={0} ref={containerRef}>
      {/* Viewer */}
      <div className="bg-ink rounded-sm overflow-hidden">
        <div className="container-edit py-12 md:py-16">
          <div className="flex items-center justify-center gap-0 mx-auto" style={{ maxWidth: spreadView ? "920px" : "460px" }}>
            {leftPage && (
              <div
                className={`aspect-[3/4] transition-all duration-500 ${
                  spreadView ? "w-1/2" : "w-full"
                } ${spreadView ? "rounded-l-sm overflow-hidden" : "rounded-sm overflow-hidden"}`}
                style={{
                  boxShadow: spreadView
                    ? "-4px 0 20px -6px rgba(0,0,0,0.5)"
                    : "0 4px 24px -8px rgba(0,0,0,0.5)",
                }}
              >
                <PreviewPage
                  layout={leftPage.layout}
                  pageNumber={leftPage.displayNumber}
                  isSpreadRight={spreadView}
                />
              </div>
            )}
            {rightPage && (
              <div
                className="w-1/2 aspect-[3/4] rounded-r-sm overflow-hidden transition-all duration-500"
                style={{ boxShadow: "4px 0 20px -6px rgba(0,0,0,0.5)" }}
              >
                <PreviewPage
                  layout={rightPage.layout}
                  pageNumber={rightPage.displayNumber}
                  isSpreadLeft={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="container-edit pb-8">
          <div className="flex items-center justify-between text-background/70">
            <button
              onClick={goPrev}
              disabled={safePage === 0}
              className="btn-ghost !text-background/80 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            <div className="flex items-center gap-6">
              <span className="eyebrow !text-background/60">{displayLabel}</span>
              <button
                onClick={() => setSpreadView((v) => !v)}
                className="text-[0.55rem] uppercase tracking-[0.25em] text-background/50 hover:text-background/80 transition-colors"
              >
                {spreadView ? "Single" : "Spread"}
              </button>
            </div>

            <button
              onClick={goNext}
              disabled={safePage >= maxPage}
              className="btn-ghost !text-background/80 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="container-edit py-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {thumbnails.map((p, i) => {
            const thumbIndex = i * (spreadView ? 2 : 1);
            const isActive = safePage === thumbIndex || (spreadView && safePage + 1 === thumbIndex);
            const hasRight = spreadView && thumbIndex + 1 < totalDisplay;
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(thumbIndex)}
                className={`shrink-0 transition-all duration-200 ${
                  isActive ? "ring-2 ring-foreground opacity-100" : "opacity-50 hover:opacity-80"
                }`}
                style={{ width: hasRight ? "120px" : "60px" }}
              >
                <div className="flex h-20 rounded-sm overflow-hidden">
                  <div className={hasRight ? "w-1/2" : "w-full"}>
                    <PreviewPage
                      layout={p.layout}
                      pageNumber={p.displayNumber}
                    />
                  </div>
                  {hasRight && thumbIndex + 1 < totalDisplay && (
                    <div className="w-1/2 border-l border-black/5">
                      <PreviewPage
                        layout={allPages[thumbIndex + 1].layout}
                        pageNumber={allPages[thumbIndex + 1].displayNumber}
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
