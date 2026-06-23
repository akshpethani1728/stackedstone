const MM_TO_POINTS = 2.83465;

export type EditionDimensions = {
  pageWidthPoints: number;
  pageHeightPoints: number;
  bleedPoints: number;
  safeMarginPoints: number;
};

function inToPoints(inches: number): number {
  return inches * 72;
}

export function getEditionDimensions(editionSlug: string): EditionDimensions {
  const bleed = 3 * MM_TO_POINTS;
  const safeMargin = 15 * MM_TO_POINTS;

  switch (editionSlug) {
    case "weekend":
      return { pageWidthPoints: inToPoints(8), pageHeightPoints: inToPoints(10), bleedPoints: bleed, safeMarginPoints: safeMargin };
    case "journey":
      return { pageWidthPoints: inToPoints(9), pageHeightPoints: inToPoints(12), bleedPoints: bleed, safeMarginPoints: safeMargin };
    case "explorer":
      return { pageWidthPoints: inToPoints(10), pageHeightPoints: inToPoints(13), bleedPoints: bleed, safeMarginPoints: safeMargin };
    case "collector":
      return { pageWidthPoints: inToPoints(9), pageHeightPoints: inToPoints(12), bleedPoints: bleed, safeMarginPoints: safeMargin };
    default:
      return { pageWidthPoints: inToPoints(9), pageHeightPoints: inToPoints(12), bleedPoints: bleed, safeMarginPoints: safeMargin };
  }
}
