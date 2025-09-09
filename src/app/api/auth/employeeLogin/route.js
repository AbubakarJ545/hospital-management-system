import connectionToDb from "@/app/lib/mongoose";
import Employee from "../../../../../Models/employees.model.js";
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
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }
    const isValid = await bcrypt.compare(password, employee.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect Password" },
        { status: 401 }
      );
    }
    const payload = {
      sub: String(employee._id),
      role: employee.role || "employee",
      email: employee.email,
      name: employee.name,
      permissions: employee.permissions || [],
    };
    const token = signJWT(payload);
    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        employee: {
          email: employee.email,
          id: employee._id,
          name: employee.name,
          position: employee.position,
          role: employee.role,
          permissions: employee.permissions || [],
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
