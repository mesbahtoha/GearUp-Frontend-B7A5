import { z } from "zod";

export const gearSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(1, "Brand is required"),
  image: z.string().optional(),
  pricePerDay: z.number().positive("Price must be positive"),
  stock: z.number().int().positive("Stock must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
  isAvailable: z.boolean(),
});

export type GearFormValues = z.infer<typeof gearSchema>;
