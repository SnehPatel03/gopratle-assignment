import mongoose, { Schema } from "mongoose";

const PerformerSchema = new Schema(
  {
    requirementId: {
      type: Schema.Types.ObjectId,
      ref: "Requirement",
      required: true,
      unique: true,
    },
    performanceType: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    performersCount: {
      type: Number,
      required: true,
      min: 1,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    equipment: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Performer =
  mongoose.models.Performer || mongoose.model("Performer", PerformerSchema);
