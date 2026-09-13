import mongoose, { Schema } from "mongoose";

const RequirementSchema = new Schema(
  {
    requirementId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["planner", "performer", "crew"],
    },
    event: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        required: true,
        trim: true,
      },
      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },
      location: {
        type: String,
        required: true,
        trim: true,
      },

      venue: {
        type: String,
        trim: true,
      },
    },
    budget: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      flexible: {
        type: Boolean,
        default: false,
      },
    },
    additionalRequirements: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);
export const Requirement =
  mongoose.models.Requirement || mongoose.model("Requirement", RequirementSchema);
