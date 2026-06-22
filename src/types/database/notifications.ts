import type { NotificationChannel, NotificationType } from "./enums";
import type { AuditTimestamps } from "./common";

export interface Notification extends AuditTimestamps {
  id: string;
  user_id: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject: string;
  body: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  sent_at: string | null;
}
