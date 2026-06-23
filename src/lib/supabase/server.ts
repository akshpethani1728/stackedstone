import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie, deleteCookie } from "vinxi/http";

import type { Database } from "./types";

let serverClient: ReturnType<typeof createServerClient<Database>> | null = null;

export function getSupabaseServerClient() {
  if (serverClient) return serverClient;

  const url = process.env.VITE_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
    );
  }

  serverClient = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return parseCookies();
      },
      setAll(cookies) {
        for (const { name, value, options } of cookies) {
          setCookie(name, value, options);
        }
      },
    },
  });

  return serverClient;
}

export function getSupabaseServiceClient() {
  const url = process.env.VITE_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    );
  }

  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, serviceKey);
}
