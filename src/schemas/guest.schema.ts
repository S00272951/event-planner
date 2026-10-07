import { z } from "zod";

export const guestSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  rsvp: z.enum(["yes", "no", "pending"]).optional(),
});