import { NextResponse } from "next/server";
import { signJWT } from "@/app/lib/jwt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Get from env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      const payload = { sub: "admin", role: "admin", email };
      const token = signJWT(payload);
      const res = NextResponse.json({
        success: true,
        admin: { email },
        token,
      });
      res.headers.set(
        "Set-Cookie",
        `token=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`
      );
      return res;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
