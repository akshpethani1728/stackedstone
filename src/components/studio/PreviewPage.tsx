import type { PageLayout } from "@/types/preview";

type Props = {
  layout: PageLayout;
  pageNumber: number;
  isSpreadLeft?: boolean;
  isSpreadRight?: boolean;
};

export function PreviewPage({ layout, pageNumber, isSpreadLeft, isSpreadRight }: Props) {
  const { templateId, photoAssignments } = layout;

  return (
    <div
      className="relative w-full h-full bg-stone-warm/90 overflow-hidden select-none"
      style={{
        boxShadow:
          isSpreadLeft
            ? "inset -6px 0 8px -4px rgba(0,0,0,0.08)"
            : isSpreadRight
              ? "inset 6px 0 8px -4px rgba(0,0,0,0.08)"
              : "none",
      }}
    >
      {/* Page edge shadow */}
      {isSpreadLeft && <div className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-l from-black/8 to-transparent" />}
      {isSpreadRight && <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-r from-black/8 to-transparent" />}

      {renderTemplate(templateId, photoAssignments)}

      {/* Page number */}
      {templateId !== "cover" && templateId !== "closing" && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center">
          <span className="text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground/50">
            {pageNumber}
          </span>
        </div>
      )}
    </div>
  );
}

function renderTemplate(templateId: string, assignments: any[]) {
  switch (templateId) {
    case "cover":
      return <CoverLayout assignments={assignments} />;
    case "full":
      return <FullLayout assignments={assignments} />;
    case "panorama":
      return <PanoramaLayout assignments={assignments} />;
    case "story":
      return <StoryLayout assignments={assignments} />;
    case "two-portrait":
      return <TwoPortraitLayout assignments={assignments} />;
    case "two-landscape":
      return <TwoLandscapeLayout assignments={assignments} />;
    case "split":
      return <SplitLayout assignments={assignments} />;
    case "hero-small":
      return <HeroSmallLayout assignments={assignments} />;
    case "three-grid":
      return <ThreeGridLayout assignments={assignments} />;
    case "four-grid":
      return <FourGridLayout assignments={assignments} />;
    case "closing":
      return <ClosingLayout assignments={assignments} />;
    default:
      return <FullLayout assignments={assignments} />;
  }
}

function PhotoSlot({ url, className }: { url?: string; className?: string }) {
  if (!url) return <div className={`bg-stone-warm/50 ${className ?? ""}`} />;
  return (
    <img
      src={url}
      alt=""
      className={`w-full h-full object-cover ${className ?? ""}`}
      loading="lazy"
    />
  );
}

function CoverLayout({ assignments }: any) {
  return (
    <div className="relative w-full h-full">
      {assignments[0] && (
        <img src={assignments[0].url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}

function FullLayout({ assignments }: any) {
  return <PhotoSlot url={assignments[0]?.url} className="absolute inset-0" />;
}

function PanoramaLayout({ assignments }: any) {
  return (
    <div className="absolute inset-0 flex items-center">
      <PhotoSlot url={assignments[0]?.url} className="h-3/5" />
    </div>
  );
}

function StoryLayout({ assignments }: any) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1">
        <PhotoSlot url={assignments[0]?.url} className="h-full" />
      </div>
      <div className="h-16 flex items-center justify-center px-6">
        <p className="text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground/30 italic">
          &nbsp;
        </p>
      </div>
    </div>
  );
}

function TwoPortraitLayout({ assignments }: any) {
  return (
    <div className="absolute inset-0 flex">
      <div className="flex-1">
        <PhotoSlot url={assignments[0]?.url} className="h-full" />
      </div>
      <div className="w-px bg-black/5" />
      <div className="flex-1">
        <PhotoSlot url={assignments[1]?.url} className="h-full" />
      </div>
    </div>
  );
}

function TwoLandscapeLayout({ assignments }: any) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1">
        <PhotoSlot url={assignments[0]?.url} className="h-full" />
      </div>
      <div className="h-px bg-black/5" />
      <div className="flex-1">
        <PhotoSlot url={assignments[1]?.url} className="h-full" />
      </div>
    </div>
  );
}

function SplitLayout({ assignments }: any) {
  return (
    <div className="absolute inset-0 flex">
      <div className="w-1/2">
        <PhotoSlot url={assignments[0]?.url} className="h-full" />
      </div>
      <div className="w-px bg-black/5" />
      <div className="w-1/2">
        <PhotoSlot url={assignments[1]?.url} className="h-full" />
      </div>
    </div>
  );
}

function HeroSmallLayout({ assignments }: any) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-[3]">
        <PhotoSlot url={assignments[0]?.url} className="h-full" />
      </div>
      <div className="h-px bg-black/5" />
      <div className="flex-1">
        <PhotoSlot url={assignments[1]?.url} className="h-full" />
      </div>
    </div>
  );
}

function ThreeGridLayout({ assignments }: any) {
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-black/5">
      <div className="row-span-2">
        <PhotoSlot url={assignments[0]?.url} className="h-full" />
      </div>
      <div>
        <PhotoSlot url={assignments[1]?.url} className="h-full" />
      </div>
      <div>
        <PhotoSlot url={assignments[2]?.url} className="h-full" />
      </div>
    </div>
  );
}

function FourGridLayout({ assignments }: any) {
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-black/5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i}>
          <PhotoSlot url={assignments[i]?.url} className="h-full" />
        </div>
      ))}
    </div>
  );
}

function ClosingLayout({ assignments }: any) {
  return (
    <div className="relative w-full h-full">
      {assignments[0] && (
        <img src={assignments[0].url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-warm/60 to-stone-warm/90" />
      <div className="absolute bottom-12 inset-x-0 text-center">
        <p className="font-serif italic text-xl text-muted-foreground/60">The End</p>
      </div>
    </div>
  );
}
