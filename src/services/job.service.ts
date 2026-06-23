import { getSupabaseClient } from "@/lib/supabase";
import { fromSupabaseError, NotFoundError } from "@/lib/errors";
import { config } from "@/config";
import type { Job, JobType, JobStatus } from "@/types/production";

export const JobService = {
  async create(type: JobType, payload: Record<string, unknown> = {}): Promise<Job> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("jobs")
      .insert({ type, payload, status: "pending", max_attempts: config.production.maxRetries })
      .select()
      .single();

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async claimNext(): Promise<Job | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .rpc("claim_next_job");

    if (error) throw fromSupabaseError(error);
    return data;
  },

  async start(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const job = await JobService.getById(id);
    const { error } = await supabase
      .from("jobs")
      .update({
        status: "processing",
        started_at: new Date().toISOString(),
        attempts: job.attempts + 1,
      })
      .eq("id", id)
      .eq("status", "pending");

    if (error) throw fromSupabaseError(error);
  },

  async complete(id: string, result: Record<string, unknown> = {}): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("jobs")
      .update({ status: "completed", result, completed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw fromSupabaseError(error);
  },

  async fail(id: string, errorMessage: string): Promise<void> {
    const supabase = getSupabaseClient();
    const job = await JobService.getById(id);

    const updates: Record<string, unknown> = {
      status: job.attempts >= job.max_attempts - 1 ? "failed" : "pending",
      error_message: errorMessage,
      attempts: job.attempts + 1,
    };

    if (updates.status === "pending") {
      updates.scheduled_for = new Date(Date.now() + 30000 * (job.attempts + 1)).toISOString();
    } else {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase.from("jobs").update(updates).eq("id", id);
    if (error) throw fromSupabaseError(error);
  },

  async retry(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("jobs")
      .update({ status: "pending", error_message: null, attempts: 0, scheduled_for: null })
      .eq("id", id);

    if (error) throw fromSupabaseError(error);
  },

  async cancel(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("jobs")
      .update({ status: "cancelled", completed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw fromSupabaseError(error);
  },

  async getById(id: string): Promise<Job> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw fromSupabaseError(error);
    if (!data) throw new NotFoundError("Job", id);
    return data;
  },

  async listPending(): Promise<Job[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async listByBook(bookId: string): Promise<Job[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .filter("payload->>bookId", "eq", bookId)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async listByOrder(orderId: string): Promise<Job[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .filter("payload->>orderId", "eq", orderId)
      .order("created_at", { ascending: false });

    if (error) throw fromSupabaseError(error);
    return data ?? [];
  },

  async processQueue(): Promise<void> {
    const jobs = await JobService.listPending();
    for (const job of jobs) {
      try {
        await JobService.start(job.id);
        await JobService.complete(job.id, { processed: true });
      } catch (err: any) {
        await JobService.fail(job.id, err.message);
      }
    }
  },
};
