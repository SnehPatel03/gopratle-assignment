import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "Connection Done!",
    });
  } catch (error) {
    console.error("Database connection error: ", error);

    return NextResponse.json(
      { success: false, message: "DB connection failed" },
      { status: 503 },
    );
  }
}
