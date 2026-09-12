import mongoose, { Schema } from "mongoose";

const PlannerSchema = new Schema(
  {
    requirementId: {
      type: Schema.Types.ObjectId,
      ref: "Requirement",
      required: true,
      unique: true,
    },
    services: {
      type: [String],
      required: true,
      default: [],
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    eventScale: {
      type: String,
      required: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Planner = mongoose.models.Planner || mongoose.model("Planner", PlannerSchema);
