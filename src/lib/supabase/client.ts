import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseClient() {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
    );
  }

  client = createBrowserClient<Database>(url, anonKey);
  return client;
}
