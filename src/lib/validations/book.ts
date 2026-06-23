import { z } from "zod";

export const extrasSchema = z.object({
  gift_wrap: z.boolean().default(false),
  gift_message: z.string().max(500).default(""),
  storage_box: z.boolean().default(false),
  extra_copy: z.boolean().default(false),
});

export const bookSchema = z.object({
  destination_id: z.string().uuid().nullable().optional(),
  edition_id: z.string().uuid().nullable().optional(),
  cover_design_id: z.string().uuid().nullable().optional(),
  material_id: z.string().uuid().nullable().optional(),
  paper_type_id: z.string().uuid().nullable().optional(),
  page_count_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(200).nullable().optional(),
  extras: extrasSchema.optional(),
});

export const bookUpdateSchema = bookSchema.partial();

export type BookInput = z.infer<typeof bookSchema>;
export type BookUpdate = z.infer<typeof bookUpdateSchema>;
