import { getSupabaseServerClient } from "@/lib/supabase/server";

import { UnauthorizedError } from "@/lib/errors";

export async function requireAuth() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new UnauthorizedError();
  return data.user;
}

export async function getSession() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export async function protectRoute() {
  const user = await requireAuth();
  return user;
}
