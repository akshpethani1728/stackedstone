import type { JobType, JobStatus } from "./enums";
import type { AuditTimestamps } from "./common";

export interface Job extends AuditTimestamps {
  id: string;
  type: JobType;
  status: JobStatus;
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  error_message: string | null;
  attempts: number;
  max_attempts: number;
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
}
