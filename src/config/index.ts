export const config = {
  appName: "Stacked Stone",
  appUrl: typeof window !== "undefined" ? window.location.origin : "",
  shipping: {
    acrossIndia: 499,
    estimatedDays: "10–14 days",
  },
  studio: {
    storageKey: "stacked.studio.v2",
    steps: [
      { n: "01", label: "Destination", to: "/destination" },
      { n: "02", label: "Edition", to: "/create" },
      { n: "03", label: "Cover", to: "/cover" },
      { n: "04", label: "Material", to: "/material" },
      { n: "05", label: "Paper", to: "/paper" },
      { n: "06", label: "Pages", to: "/pages" },
      { n: "07", label: "Photographs", to: "/upload" },
      { n: "08", label: "Preview", to: "/preview" },
    ],
  },
} as const;
