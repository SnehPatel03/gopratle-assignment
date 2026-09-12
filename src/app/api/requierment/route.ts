import { NextRequest, NextResponse } from "next/server";
import { Requirement } from "@/models/Requirement";
import { Planner } from "@/models/Planner";
import { Performer } from "@/models/Performer";
import { Crew } from "@/models/Crew";
import { connectDB } from "@/lib/db";
import { requirementSchema } from "@/lib/validations/requirement.schema";

export async function GET() {
  try {
    await connectDB();

    const requirements = await Requirement.find().sort({ createdAt: -1 }).lean();;

    return NextResponse.json({
      success: true,
      count: requirements.length,
      data: requirements,
    });
  } catch (error) {
    console.error("Get requirements error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to get requirements." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const result = requirementSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.issues,
        },
        { status: 400 },
      );
    }

    const data = result.data;
    const startDate = data.event.startDate;
    const endDate = data.event.endDate;
    if (endDate < startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Enddate cant come before than start date",
          errors: [
            {
              field: "event.endDate",
              message: "End date must be equal to or later than start date",
            },
          ],
        },
        { status: 400 },
      );
    }

    const requirement = await Requirement.create({
      requirementId: `REQ-${new Date().getFullYear()}-${Date.now()}`,
      category: data.category,
      event: data.event,
      budget: data.budget,
      additionalRequirements: data.additionalRequirements,
      status: data.status,
    });

    switch (data.category) {
      case "planner":
        await Planner.create({
          requirementId: requirement._id,
          ...data.categoryDetails,
        });
        break;

      case "performer":
        await Performer.create({
          requirementId: requirement._id,
          ...data.categoryDetails,
        });
        break;

      case "crew":
        await Crew.create({
          requirementId: requirement._id,
          ...data.categoryDetails,
        });
        break;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Requirement created successfully",
        data: {
          requirementId: requirement.requirementId,
          category: requirement.category,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create requirement error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create requirement.",
      },
      { status: 500 },
    );
  }
}
