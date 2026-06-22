export type Edition = {
  slug: "weekend" | "journey" | "explorer" | "collector";
  name: string;
  pages: string;
  size: string;
  price: number;
  ideal: string;
  photoEstimate: string;
  description: string;
};

export type Destination = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
};

export type Cover = {
  slug: string;
  name: string;
  mood: string;
  ink: string;
  panel: string;
  image: string;
};

export type Material = {
  slug: string;
  name: string;
  feel: string;
  description: string;
  priceDelta: number;
  swatch: string;
  texture: string;
};

export type Paper = {
  slug: string;
  name: string;
  weight: string;
  finish: string;
  bestFor: string;
  priceDelta: number;
  texture: string;
};

export type PageCount = {
  pages: number;
  label: string;
  recommended: [number, number];
  ideal: string;
  priceDelta: number;
};

export type Extras = {
  giftWrap: boolean;
  giftMessage: string;
  storageBox: boolean;
  extraCopy: boolean;
};

export type StudioState = {
  destination?: Destination;
  edition?: Edition;
  cover?: Cover;
  material?: Material;
  paper?: Paper;
  pageCount?: PageCount;
  photos: string[];
  photoCount: number;
  title?: string;
  extras: Extras;
};
