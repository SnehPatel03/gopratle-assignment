import mongoose, { Schema } from "mongoose";

const CrewSchema = new Schema(
  {
    requirementId: {
      type: Schema.Types.ObjectId,
      ref: "Requirement",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    crewCount: {
      type: Number,
      required: true,
      min: 1,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    workingHours: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true },
);

export const Crew = mongoose.models.Crew || mongoose.model("Crew", CrewSchema);
