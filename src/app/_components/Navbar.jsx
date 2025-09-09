"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setIsAuthed(Boolean(data?.authenticated));
      } catch {
        if (!cancelled) setIsAuthed(false);
      }
    };
    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", null, { withCredentials: true });
    } catch (e) {
      // ignore
    } finally {
      try {
        localStorage.removeItem("admin");
        localStorage.removeItem("doctor");
        localStorage.removeItem("employee");
      } catch {}
      window.location.href = "/";
    }
  };

  return (
    <nav className="bg-red-600 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Jamal Hospital
        </Link>

        {/* Links */}
        <div className="space-x-6 hidden md:flex items-center relative">
          <Link href="/" className="text-white hover:text-gray-200">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-200">
            About
          </Link>
          <Link
            href="/CustomerDepartment"
            className="text-white hover:text-gray-200"
          >
            Departments
          </Link>

          {/* Admin Dropdown */}
          <div className="relative" onClick={() => setIsOpen(true)}>
            <button className="text-white hover:text-gray-200 focus:outline-none cursor-pointer">
              Admin ▾
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden">
                <Link
                  href="/EmployeeLogin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Receptionist Login
                </Link>
                <Link
                  href="/DoctorLogin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Doctor Login
                </Link>
                <Link
                  href="/Admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          {isAuthed && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
