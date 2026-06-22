import type { Cover, Destination, Edition } from "@/types";

type Props = {
  cover: Cover;
  destination?: Destination;
  edition?: Edition;
  title?: string;
  photo?: string;       // optional user photo to substitute as the cover image
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<Props["size"]>, string> = {
  sm: "max-w-[260px]",
  md: "max-w-[420px]",
  lg: "max-w-[620px]",
};

export function BookMockup({ cover, destination, edition, title, photo, className = "", size = "md" }: Props) {
  const heroImage = photo || cover.image;
  const displayTitle = title || destination?.name || "Untitled Volume";

  return (
    <div className={`relative ${sizeMap[size]} mx-auto ${className}`}>
      {/* Cast shadow */}
      <div className="absolute -inset-x-6 bottom-[-22px] h-6 bg-ink/30 blur-2xl rounded-full" aria-hidden />

      {/* Book body */}
      <div
        className="relative aspect-[4/5] book-shadow bg-stone-warm overflow-hidden"
        style={{
          boxShadow:
            "0 1px 2px rgba(20,16,10,0.08), 0 50px 90px -30px rgba(20,16,10,0.55), 0 24px 60px -36px rgba(20,16,10,0.5)",
        }}
      >
        <img src={heroImage} alt={displayTitle} className="absolute inset-0 h-full w-full object-cover" />

        {/* Edge of paper (right side) */}
        <div className="absolute inset-y-0 right-0 w-[6px] bg-gradient-to-l from-stone-warm/95 via-stone-warm/30 to-transparent" aria-hidden />
        {/* Spine shadow (left) */}
        <div className="absolute inset-y-0 left-0 w-[14px] bg-gradient-to-r from-black/45 via-black/15 to-transparent" aria-hidden />
        {/* Top inner shadow */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/25 to-transparent" aria-hidden />

        {/* Typographic panel */}
        <div
          className="absolute left-6 right-6 bottom-6 px-6 py-7"
          style={{ backgroundColor: cover.panel, color: cover.ink }}
        >
          <p
            className="uppercase font-sans"
            style={{ fontSize: "0.58rem", letterSpacing: "0.32em", opacity: 0.8 }}
          >
            Stacked Stone · {edition?.name?.replace(" Edition", "") ?? "Volume"}
          </p>
          <p
            className="font-serif italic mt-3"
            style={{ fontSize: "clamp(1.2rem, 3.2vw, 2rem)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
          >
            {displayTitle}
          </p>
          {destination?.region && (
            <p
              className="font-sans mt-3"
              style={{ fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.75 }}
            >
              {destination.region}
            </p>
          )}
        </div>

        {/* Cover treatment name in corner */}
        <p
          className="absolute top-5 right-5 font-sans"
          style={{ color: cover.ink, fontSize: "0.55rem", letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.75 }}
        >
          {cover.name}
        </p>
      </div>
    </div>
  );
}
