"use client";
import React, { useEffect, useState } from "react";
import AdminDashboard from "../_components/AdminDashboard";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // loader state
  const router = useRouter();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin"); // make sure it's lowercase (consistent with login)
    if (storedAdmin) {
      setAdmin(true);
    } else {
      router.push("/AdminLogin");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">Checking access...</p>
    );
  }

  return <div>{admin ? <AdminDashboard /> : null}</div>;
}
