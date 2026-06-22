export interface AuditTimestamps {
  created_at: string;
  updated_at: string;
}

export interface SoftDeletable {
  deleted_at: string | null;
}
