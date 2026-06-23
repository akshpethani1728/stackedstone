import { z } from "zod";

export const addressSchema = z.object({
  type: z.enum(["shipping", "billing"]).default("shipping"),
  line1: z.string().min(1, "Street address is required").max(200),
  line2: z.string().max(200).nullable().optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).nullable().optional(),
  postal_code: z.string().min(1, "PIN Code is required").max(20),
  country: z.string().min(1).max(100).default("India"),
  is_default: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
