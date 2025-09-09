import connectionToDb from "@/app/lib/mongoose";
import Doctor from "../../../../Models/doctors.model.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureRole } from "@/app/lib/auth";

// CREATE Doctor
export async function POST(req) {
  await connectionToDb();

  try {
    const auth = ensureRole(req, ["admin"]);
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.message },
        { status: auth.status }
      );
    }
    const data = await req.json();

    // ✅ Validate required fields matching schema
    const missingFields = [];
    if (!data.firstName) missingFields.push("firstName");
    if (!data.lastName) missingFields.push("lastName");
    if (!data.password) missingFields.push("password");
    if (!data.departmentId) missingFields.push("departmentId");
    if (!data.dob) missingFields.push("dob");
    if (!data.gender) missingFields.push("gender");
    if (!data.phone) missingFields.push("phone");
    if (!data.qualification) missingFields.push("qualification");

    const availabilityDays = Array.isArray(data.availabilityDays)
      ? data.availabilityDays
      : undefined;
    if (!availabilityDays || availabilityDays.length === 0) {
      missingFields.push("availabilityDays");
    }

    const availabilityTime = data.availabilityTime || {};
    if (!availabilityTime.start) missingFields.push("availabilityTime.start");
    if (!availabilityTime.end) missingFields.push("availabilityTime.end");

    const feeNumber = data.fee !== undefined && data.fee !== null ? Number(data.fee) : NaN;
    if (Number.isNaN(feeNumber) || feeNumber < 0) missingFields.push("fee");

    // Validate DOB parsable
    const dobDate = new Date(data.dob);
    if (isNaN(dobDate.getTime())) missingFields.push("dob (invalid date)");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing or invalid fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // ✅ Prepare doctor data aligned with schema
    const doctorData = {
      firstName: data.firstName,
      lastName: data.lastName,
      dob: dobDate,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      qualification: data.qualification,
      experience: data.experience,
      address: data.address,
      password: data.password,
      availabilityDays,
      availabilityTime: { start: availabilityTime.start, end: availabilityTime.end },
      fee: feeNumber,
      department: data.departmentId, // ✅ Consistent naming with schema
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    doctorData.password = await bcrypt.hash(doctorData.password, salt);

    // ✅ Save doctor
    const newDoctor = await Doctor.create(doctorData);

    // ✅ Populate department before returning
    const populatedDoctor = await Doctor.findById(newDoctor._id).populate(
      "department",
      "name"
    );

    return NextResponse.json(
      { success: true, data: populatedDoctor },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Doctor:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// GET Doctors (Optional department filter and search)
export async function GET(req) {
  await connectionToDb();
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const search = searchParams.get("search");

    let query = {};
    if (departmentId) query.department = departmentId;
    
    // Add search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { qualification: { $regex: search, $options: "i" } }
      ];
    }

    // ✅ Populate department for GET too
    const doctors = await Doctor.find(query).populate("department", "name");

    return NextResponse.json({ success: true, data: doctors }, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
