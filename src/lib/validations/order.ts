import { z } from "zod";

export const orderItemSchema = z.object({
  book_id: z.string().uuid().nullable().optional(),
  item_type: z.enum(["book", "extra_copy", "gift_wrap", "storage_box"]),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive().default(1),
  unit_price: z.number().int().nonnegative(),
});

export const orderSchema = z.object({
  address_id: z.string().uuid(),
  notes: z.string().max(1000).nullable().optional(),
  items: z.array(orderItemSchema).min(1),
});

export type OrderInput = z.infer<typeof orderSchema>;
