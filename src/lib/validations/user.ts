import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(1).max(100).nullable().optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone number")
    .nullable()
    .optional(),
  avatar_url: z.string().url().nullable().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
