import type { UserRole, AddressType } from "./enums";
import type { AuditTimestamps, SoftDeletable } from "./common";

export interface User extends AuditTimestamps, SoftDeletable {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  email_verified_at: string | null;
  last_sign_in_at: string | null;
}

export interface AdminUser extends AuditTimestamps, SoftDeletable {
  id: string;
  user_id: string;
  role: Exclude<UserRole, UserRole.Customer>;
  permissions: Record<string, boolean> | null;
}

export interface Address extends AuditTimestamps, SoftDeletable {
  id: string;
  user_id: string;
  type: AddressType;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
}
