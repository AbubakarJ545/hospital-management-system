
import connectionToDb from "@/app/lib/mongoose";
import patientsModel from "../../../../Models/patients.model.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectionToDb();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    let query = {};
    if (doctorId) {
      query.doctorId = doctorId; // filter by doctor if provided
    }

    const patients = await patientsModel
      .find(query)
      .populate("departmentId", "name")
      .populate("doctorId", "firstName lastName");

    return NextResponse.json(
      { success: true, data: patients },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(req) {
  try {
    await connectionToDb();
    const data = await req.json();
    const { departmentId, doctorId, appointmentDate, appointmentTime } = data;

    if (!departmentId || !doctorId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    // Merge date + time into one Date object
    const appointmentDateTime = new Date(
      `${appointmentDate}T${appointmentTime}:00`
    );
    data.appointmentDate = appointmentDateTime; // store full datetime

    // 30-min overlap window
    const bufferStartTime = new Date(
      appointmentDateTime.getTime() - 30 * 60000
    );
    const bufferEndTime = new Date(appointmentDateTime.getTime() + 30 * 60000);

    // Check for overlapping appointment
    const existingAppointment = await patientsModel.findOne({
      departmentId,
      doctorId,
      appointmentDate: { $gte: bufferStartTime, $lt: bufferEndTime },
    });

    if (existingAppointment) {
      return NextResponse.json(
        {
          success: false,
          error: "This time slot or next 30 mins is already booked.",
        },
        { status: 400 }
      );
    }

    // Save patient
    const newPatient = await patientsModel.create(data);

    // Return populated doc so UI has names immediately
    const populated = await patientsModel
      .findById(newPatient._id)
      .populate("departmentId", "name")
      .populate("doctorId", "firstName lastName");

    return NextResponse.json(
      { success: true, data: populated },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating patient:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
