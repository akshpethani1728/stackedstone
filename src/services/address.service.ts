import { getSupabaseClient } from "@/lib/supabase";
import { AuthService } from "@/services/auth.service";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";
import type { Address, AddressInput } from "@/types/checkout";

export const AddressService = {
  async list(): Promise<Address[]> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async getById(id: string): Promise<Address> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Address", id);
    return data;
  },

  async create(input: AddressInput): Promise<Address> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();

    if (input.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .is("deleted_at", null);
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        name: input.name,
        phone: input.phone,
        line1: input.line1,
        line2: input.line2 ?? null,
        city: input.city,
        state: input.state ?? null,
        postal_code: input.postal_code,
        country: input.country ?? "India",
        is_default: input.is_default ?? false,
      })
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async update(id: string, input: Partial<AddressInput>): Promise<Address> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();

    if (input.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .neq("id", id);
    }

    const { data, error } = await supabase
      .from("addresses")
      .update(input)
      .eq("id", id)
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Address", id);
    return data;
  },

  async delete(id: string): Promise<void> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("addresses")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id)
      .is("deleted_at", null);

    if (error) throw fromSupabaseError(error);
  },

  async setDefault(id: string): Promise<void> {
    const user = await AuthService.requireAuth();
    const supabase = getSupabaseClient();

    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .neq("id", id);

    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id)
      .is("deleted_at", null);

    if (error) throw fromSupabaseError(error);
  },
};
