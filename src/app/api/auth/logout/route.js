import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Clear cookie by setting Max-Age=0
  res.headers.set(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"
  );
  return res;
}


