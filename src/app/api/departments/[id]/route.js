import connectionToDb from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import Doctor from "../../../../../Models/doctors.model";

export async function GET(request, { params }) {
  try {
    const { id } = await params; // department id
    await connectionToDb();

    // Find doctors related to department
    const doctors = await Doctor.find({ department: id }).populate(
      "department",
      "name"
    );

    return NextResponse.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
