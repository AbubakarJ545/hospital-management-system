import connectionToDb from "@/app/lib/mongoose";
import Doctor from "../../../../../Models/doctors.model.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJWT } from "@/app/lib/jwt";

export async function POST(req) {
  await connectionToDb();
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }
    const isValid = await bcrypt.compare(password, doctor.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect Password" },
        { status: 401 }
      );
    }
    const payload = {
      sub: String(doctor._id),
      role: "doctor",
      email: doctor.email || undefined,
      name: `${doctor.firstName} ${doctor.lastName}`,
    };
    const token = signJWT(payload);
    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        doctor: {
          email: doctor.email,
          id: doctor._id,
          fName: doctor.firstName,
          lName: doctor.lastName,
          fee: doctor.fee,
        },
        token,
      },
      { status: 200 }
    );
    res.headers.set(
      "Set-Cookie",
      `token=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`
    );
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
