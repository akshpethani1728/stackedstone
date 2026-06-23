export const config = {
  appName: "Stacked Stone",
  appUrl: typeof window !== "undefined" ? window.location.origin : "",

  env: {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },

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

  storage: {
    buckets: {
      bookImages: "book-images",
      bookPreviews: "book-previews",
      covers: "covers",
      destinationAssets: "destination-assets",
      thumbnails: "thumbnails",
      avatars: "avatars",
    } as const,
    maxFileSize: 20 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/tiff"] as const,
    folderPatterns: {
      bookImage: "{userId}/{bookId}/{filename}",
      preview: "{bookId}/preview.pdf",
      thumbnail: "{bookId}/thumbnails/{sortOrder}.jpg",
      avatar: "{userId}/{filename}",
    },
  },

  auth: {
    providers: ["email", "google"] as const,
    redirectAfterLogin: "/account",
    redirectAfterLogout: "/",
    passwordMinLength: 8,
  },

  limits: {
    maxPhotosPerBook: 150,
    maxFileSizeMB: 20,
    maxBooksPerUser: 50,
    maxAddressesPerUser: 10,
  },

  featureFlags: {
    enableCheckout: false,
    enableUpload: false,
    enableAuth: true,
    enableAdminPanel: false,
  },
} as const;
