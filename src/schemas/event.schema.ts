import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.coerce.date(),
  location: z.string().min(1),
  description: z.string().max(500).optional(),
});