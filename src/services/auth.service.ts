import { getSupabaseClient } from "@/lib/supabase";
import { UnauthorizedError } from "@/lib/errors";

export const AuthService = {
  async getSession(): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser(): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async requireAuth(): Promise<any> {
    const user = await AuthService.getUser();
    if (!user) throw new UnauthorizedError("Please sign in to continue");
    return user;
  },

  async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async signInWithEmail(email: string, password: string): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, name?: string): Promise<any> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(email: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    if (error) throw error;
  },
};
