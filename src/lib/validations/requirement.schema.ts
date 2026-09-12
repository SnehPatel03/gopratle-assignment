import { z } from "zod";
import { plannerSchema } from "./planner.schema";
import { performerSchema } from "./performer.schema";
import { crewSchema } from "./crew.schema";

const eventSchema = z.object({
  name: z.string().trim().min(2, "Event name must be at least 2 characters"),
  type: z.string().trim().min(2, "Event type is required"),
  startDate: z.coerce.date({
    error: "Start date is required",
  }),
  endDate: z.coerce.date({
    error: "End date is required",
  }),
  location: z.string().trim().min(2, "Location is required"),
  venue: z.string().trim().min(2, "Venue is required"),
});

const budgetSchema = z.object({
  amount: z.number().positive("Budget must be greater than 0"),
  flexible: z.boolean(),
});

export const requirementSchema = z.discriminatedUnion("category", [
  z.object({
    category: z.literal("planner"),

    event: eventSchema,

    budget: budgetSchema,

    additionalRequirements: z
      .string()
      .trim()
      .optional(),

    status: z.enum(["draft", "submitted"]).default("submitted"),

    categoryDetails: plannerSchema,
  }),

  z.object({
    category: z.literal("performer"),

    event: eventSchema,

    budget: budgetSchema,

    additionalRequirements: z
      .string()
      .trim()
      .max(1000, "Additional requirements are too long")
      .optional(),

    status: z.enum(["draft", "submitted"]).default("submitted"),

    categoryDetails: performerSchema,
  }),

  z.object({
    category: z.literal("crew"),

    event: eventSchema,

    budget: budgetSchema,

    additionalRequirements: z
      .string()
      .trim()
      .max(1000, "Additional requirements are too long")
      .optional(),

    status: z.enum(["draft", "submitted"]).default("submitted"),

    categoryDetails: crewSchema,
  }),
]);

export type RequirementInput = z.infer<typeof requirementSchema>;
