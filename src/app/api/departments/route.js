import connectionToDb from "@/app/lib/mongoose";
import departmentsModel from "../../../../Models/departments.model.js";
import { NextResponse } from "next/server";
import { ensureRole } from "@/app/lib/auth";
export async function POST(req) {
  try {
    await connectionToDb();

    const auth = ensureRole(req, ["admin"]);
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }

    const data = await req.json();
    const newDepartment = await departmentsModel.create(data);
    return NextResponse.json(
      { success: true, data: newDepartment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
export async function GET() {
  try {
    await connectionToDb();
    const departments = await departmentsModel.find({});
    return NextResponse.json(
      { success: true, data: departments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
