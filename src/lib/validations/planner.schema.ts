import { z } from "zod";
export const plannerSchema = z.object({
  services: z
    .array(z.string().trim().min(1))
    .min(1, "Atleast 1 Service is required for Planner"),
  guestCount: z.number().int().min(1, "Guest count must be at least 1"),
  eventScale: z.string().trim().min(1, "Event scale is required"),
  experienceLevel: z.string().trim().min(1, "Experience level is required"),
});
