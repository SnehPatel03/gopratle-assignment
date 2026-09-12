import {z} from 'zod'
export const crewSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, "Crew role is required"),

  crewCount: z
    .number()
    .int()
    .min(1, "Crew count must be at least 1"),

  experience: z
    .string()
    .trim()
    .min(1, "Experience is required"),

  workingHours: z
    .number()
    .min(1, "Working hours must be at least 1"),
});