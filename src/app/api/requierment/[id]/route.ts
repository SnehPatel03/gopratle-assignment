import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Crew } from "@/models/Crew";
import { Performer } from "@/models/Performer";
import { Planner } from "@/models/Planner";
import { Requirement } from "@/models/Requirement";

type paramsProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: paramsProps) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid requirement reference id." },
      { status: 400 },
    );
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const requirement = await Requirement.findById(id).lean();

    if (!requirement) {
      return NextResponse.json(
        { success: false, message: "Requirement not found." },
        { status: 404 },
      );
    }

    // Ensure the requirement belongs to the authenticated user
    if (requirement.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Requirement not found." },
        { status: 404 },
      );
    }

    let categoryDetails;

    switch (requirement.category) {
      case "planner":
        categoryDetails = await Planner.findOne({ requirementId: requirement._id }).lean();
        break;
      case "performer":
        categoryDetails = await Performer.findOne({ requirementId: requirement._id }).lean();
        break;
      case "crew":
        categoryDetails = await Crew.findOne({ requirementId: requirement._id }).lean();
        break;
    }

    return NextResponse.json({
      success: true,
      data: { ...requirement, categoryDetails },
    });
  } catch (error) {
    console.error("Get requirement error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to get requirement." },
      { status: 500 },
    );
  }
}
