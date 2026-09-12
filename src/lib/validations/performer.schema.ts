import { z } from "zod";
export const performerSchema = z.object({
  performanceType: z.string().trim().min(1, "Performance type is required"),

  genre: z.string().trim().min(1, "Genre is required"),

  performersCount: z
    .number()
    .int()
    .min(1, "Performers count need to be at least 1"),

  durationMinutes: z
    .number()
    .int()
    .min(1, "Minimum duration is 1 min"),

  equipment: z.array(z.string().trim()).default([]),
});
