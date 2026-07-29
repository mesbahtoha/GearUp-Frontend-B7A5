import { z } from "zod";

export const gearSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerDay: z.number().positive("Price must be positive"),
  location: z.string().min(2, "Location is required"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.string().min(1, "At least one image URL is required"),
  availability: z.boolean(),
});

export type GearFormValues = z.infer<typeof gearSchema>;
