import connectionToDb from "@/app/lib/mongoose";
import Doctor from "../../../../../Models/doctors.model.js";
import { NextResponse } from "next/server";
import { ensureRole } from "@/app/lib/auth";

export async function DELETE(req, { params }) {
  await connectionToDb();

  try {
    const auth = ensureRole(req, ["admin"]);
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }
    const { id } = params; // get doctor id from URL

    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Doctor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
