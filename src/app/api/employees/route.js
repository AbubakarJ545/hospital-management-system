import connectionToDb from "@/app/lib/mongoose";
import Employee from "../../../../Models/employees.model.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureRole } from "@/app/lib/auth";
import { rolePermissions } from "@/app/lib/roles";

// CREATE employee
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
    // Basic validation
    const errors = [];
    if (!data.name) errors.push("name");
    if (!data.email) errors.push("email");
    if (!data.password) errors.push("password");
    if (!data.gender) errors.push("gender");
    if (!data.phone) errors.push("phone");
    if (!data.position) errors.push("position");
    if (!data.department) errors.push("department");

    // Email format
    if (data.email) {
      const emailOk = /.+@.+\..+/.test(String(data.email));
      if (!emailOk) errors.push("email (invalid)");
    }

    // Gender enum
    if (data.gender && !["Male", "Female", "Other"].includes(data.gender)) {
      errors.push("gender (invalid)");
    }

    // Password strength: min 8, letter and number
    if (data.password) {
      const hasMinLen = String(data.password).length >= 8;
      const hasLetter = /[A-Za-z]/.test(String(data.password));
      const hasNumber = /\d/.test(String(data.password));
      if (!(hasMinLen && hasLetter && hasNumber)) {
        errors.push("password (min 8, letter and number required)");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing or invalid fields: ${errors.join(", ")}` },
        { status: 400 }
      );
    }

    // Unique email check
    const existing = await Employee.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Employee with this email already exists" },
        { status: 409 }
      );
    }

    // ✅ Validate required fields matching schema

    // ✅ Prepare doctor data aligned with schema
    const requestedRole = data.role && typeof data.role === "string" ? data.role : "employee";
    const allowedRoles = ["admin", "doctor", "receptionist", "accountant", "employee"];
    if (!allowedRoles.includes(requestedRole)) {
      return NextResponse.json(
        { success: false, error: `Invalid role: ${requestedRole}` },
        { status: 400 }
      );
    }

    // Restrict positions per role
    const normalizedPosition = String(data.position || "").trim().toLowerCase();
    const roleToAllowedPosition = {
      admin: "admin",
      receptionist: "receptionist",
      accountant: "accountant",
    };
    if (requestedRole === "doctor") {
      return NextResponse.json(
        { success: false, error: "Use doctors API to create doctors, not employees" },
        { status: 400 }
      );
    }
    if (roleToAllowedPosition[requestedRole]) {
      const required = roleToAllowedPosition[requestedRole];
      if (normalizedPosition !== required) {
        return NextResponse.json(
          { success: false, error: `Position must be '${required}' for role '${requestedRole}'` },
          { status: 400 }
        );
      }
    }
    const defaultPerms = rolePermissions[requestedRole] || [];

    const employeeData = {
      name: data.name,

      gender: data.gender,
      phone: data.phone,
      email: data.email,
      password: data.password,
      position: data.position,
      role: requestedRole,
      permissions: Array.isArray(data.permissions) && data.permissions.length > 0 ? data.permissions : defaultPerms,
      department: data.department, // ✅ Consistent naming with schema
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    employeeData.password = await bcrypt.hash(employeeData.password, salt);

    // ✅ Save employee
    const newEmployee = await Employee.create(employeeData);

    // ✅ Populate department before returning
    const populatedEmployee = await Employee.findById(newEmployee._id).populate(
      "department",
      "name"
    );

    return NextResponse.json(
      { success: true, data: populatedEmployee },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Employee:", error);
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
    const department = searchParams.get("department");
    const search = searchParams.get("search");

    let query = {};
    if (department) query.department = department;

    // Add search functionality
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    // ✅ Populate department for GET too
    const employee = await Employee.find(query).populate("department", "name");

    return NextResponse.json(
      { success: true, data: employee },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
