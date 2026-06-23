export type Extras = {
  giftWrap: boolean;
  giftMessage: string;
  storageBox: boolean;
  extraCopy: boolean;
};

export type StudioState = {
  bookId?: string;
  title?: string;
  destination?: any;
  edition?: any;
  cover?: any;
  material?: any;
  paper?: any;
  pageCount?: any;
  extras: Extras;
  photoCount: number;
  photos: string[];
};

export type Edition = {
  slug: string;
  name: string;
  pages: string;
  price: number;
  size: string;
  ideal: string;
  description: string;
  photoEstimate: string;
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
  texture?: string;
};

export type Paper = {
  slug: string;
  name: string;
  weight: string;
  finish: string;
  bestFor: string;
  priceDelta: number;
  texture?: string;
};

export type PageCount = {
  pages: number;
  label: string;
  recommended: [number, number];
  ideal: string;
  priceDelta: number;
};
