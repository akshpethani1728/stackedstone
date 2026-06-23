import { getSupabaseClient } from "@/lib/supabase";

import { UnauthorizedError } from "@/lib/errors";

export const AuthService = {
  async getSession() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async requireAuth() {
    const user = await AuthService.getUser();
    if (!user) throw new UnauthorizedError();
    return user;
  },

  async signOut() {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async signInWithEmail(email: string, password: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, name?: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(email: string) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    if (error) throw error;
  },
};
