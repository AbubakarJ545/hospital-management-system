import { NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/jwt";

export async function GET(req) {
  const user = requireAuth(req);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  // Return minimal public info
  const { sub, role, email, name, permissions } = user;
  return NextResponse.json({
    authenticated: true,
    user: { id: sub, role, email, name, permissions: permissions || [] },
  });
}



