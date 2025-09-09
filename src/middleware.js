import { NextResponse } from "next/server";

function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Protect dashboard routes
  const protectedPrefixes = [
    "/Admin",
    "/DoctorDashboard",
    "/Employee",
    "/ReceptionistDashboard",
  ];

  const needsAuth = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  // Read token from cookie first
  const cookieToken = req.cookies.get("token")?.value;
  let token = cookieToken;
  if (!token) {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) token = authHeader.substring(7);
  }

  if (!token) {
    return NextResponse.redirect(new URL("/AdminLogin", req.url));
  }
  // Decode token payload (no signature verification in middleware)
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/AdminLogin", req.url));
  }

  // Optionally, role-specific redirects
  // Admin route should be admin role
  if (pathname.startsWith("/Admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/AdminLogin", req.url));
  }
  if (pathname.startsWith("/DoctorDashboard") && payload.role !== "doctor") {
    return NextResponse.redirect(new URL("/DoctorLogin", req.url));
  }
  // Employee dashboard can allow receptionist/accountant/employee
  if (
    pathname.startsWith("/Employee") &&
    !["employee", "receptionist", "accountant", "admin"].includes(payload.role)
  ) {
    return NextResponse.redirect(new URL("/EmployeeLogin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Admin/:path*",
    "/DoctorDashboard/:path*",
    "/Employee/:path*",
    "/ReceptionistDashboard/:path*",
  ],
};


