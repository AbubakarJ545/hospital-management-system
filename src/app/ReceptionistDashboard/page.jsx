"use client";
import React, { useEffect, useState } from "react";

import Sidebar from "../_components/SideBar";
import PatientFormModal from "../_components/PatientFormModal";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const ReceptionistDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatientsAndDoctors = async () => {
      const [patients, doctors] = await Promise.all([
        axios.get("/api/patients"),
        axios.get("/api/doctors"),
      ]);

      if (patients.data.success && doctors.data.success) {
        const allPatients = patients.data.data;
        const allDoctors = doctors.data.data;
        setAppointments(allPatients);
        setDoctors(allDoctors);
      }
    };

    // Initial fetch
    fetchPatientsAndDoctors();

    // Set up periodic refresh every 10 seconds to show updated status
    const interval = setInterval(fetchPatientsAndDoctors, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-09-03"
  const todayPatients = appointments.filter((patient) => {
    return patient.appointmentDate && patient.appointmentDate.startsWith(today);
  });

  // Search and filter logic
  const filteredPatients = todayPatients.filter((patient) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const patientName =
      `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const doctorName = patient.doctorId
      ? `${patient.doctorId.firstName} ${patient.doctorId.lastName}`.toLowerCase()
      : "";
    const departmentName = patient.departmentId?.name?.toLowerCase() || "";

    return (
      patientName.includes(searchLower) ||
      doctorName.includes(searchLower) ||
      departmentName.includes(searchLower)
    );
  });

  // Pagination calculations
  const totalRecords = filteredPatients.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredPatients.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // Pagination handlers
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handleRecordsChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Page number logic with ellipses
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };
  const stats = [
    {
      title: "Total Patients",
      value: appointments.length,
      color: "bg-blue-500",
    },
    {
      title: "Appointments Today",
      value: todayPatients.length,
      color: "bg-green-500",
    },
    {
      title: "Doctors Available",
      value: doctors.length,
      color: "bg-purple-500",
    },
  ];
  const shortcuts = [
    { title: "Add Patient", action: () => setIsModalOpen(true) },
    { title: "View Doctors", action: () => router.push("/Doctors") },
    {
      title: "Schedule Appointment",
      action: () => toast.success("Schedule Appointment Clicked"),
    },
  ];

  const handlePatientAdded = (newPatient) => {
    // newPatient is populated by API now; update state immediately
    setAppointments((prev) => [newPatient, ...prev]);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", null, { withCredentials: true });
    } catch (e) {
      // ignore
    } finally {
      try {
        localStorage.removeItem("employee");
      } catch {}
      router.push("/EmployeeLogin");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Receptionist Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              onClick={() => {
                if (stat.title === "Total Patients") router.push("/Patient");
                if (stat.title === "Doctors Available") router.push("/Doctors");
              }}
              className={`relative p-4 text-white rounded-xl shadow ${stat.color} cursor-pointer hover:opacity-90 transition group`}
            >
              <h3 className="text-lg">{stat.title}</h3>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>

              {/* Tooltip */}
              <span
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
        bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 
        transition whitespace-nowrap"
              >
                {stat.title === "Total Patients"
                  ? "View Patients"
                  : stat.title === "Doctors Available"
                  ? "View Doctors"
                  : "View Appointments"}
              </span>
            </div>
          ))}
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Today's Appointments</h2>
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + recordsPerPage, totalRecords)} of{" "}
              {totalRecords} appointments
            </div>
          </div>

          {/* Search Box */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by patient name, doctor name, or department..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-xs text-gray-600">
                Search results for:{" "}
                <span className="font-medium">"{searchTerm}"</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-xs">
              <thead>
                <tr className="bg-gray-100 text-left text-xs uppercase">
                  <th className="border p-1 w-8 text-center">#</th>
                  <th className="border p-1">Time</th>
                  <th className="border p-1">Patient</th>
                  <th className="border p-1">Dept</th>
                  <th className="border p-1">Doctor</th>
                  <th className="border p-1 w-16 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((appt, index) => (
                    <tr key={index} className="hover:bg-gray-50 text-xs">
                      <td className="border p-1 text-center">
                        {startIndex + index + 1}
                      </td>
                      <td className="border p-1">
                        {appt.appointmentTime || "N/A"}
                      </td>
                      <td className="border p-1">
                        {appt.firstName} {appt.lastName}
                      </td>
                      <td className="border p-1">
                        {appt.departmentId?.name || "N/A"}
                      </td>
                      <td className="border p-1">
                        {appt.doctorId
                          ? `${appt.doctorId.firstName} ${appt.doctorId.lastName}`
                          : "N/A"}
                      </td>
                      <td className="border p-1 text-center">
                        <span
                          className={`px-1 py-0.5 rounded text-xs text-white inline-block
                    ${appt.checked ? "bg-green-500" : "bg-red-500"}`}
                        >
                          {appt.checked ? "✓" : "⏳"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="border p-2 text-center text-gray-500"
                    >
                      {searchTerm
                        ? `No appointments found for "${searchTerm}"`
                        : "No appointments for today"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Show</span>
                <select
                  value={recordsPerPage}
                  onChange={handleRecordsChange}
                  className="border rounded px-1 py-1 text-xs"
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
                <span className="text-gray-600">entries</span>
              </div>

              <div className="flex gap-1 items-center">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded border text-xs ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500"
                      : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  Prev
                </button>
                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => page !== "..." && setCurrentPage(page)}
                    className={`px-2 py-1 rounded border text-xs ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : page === "..."
                        ? "bg-gray-100 text-gray-600 cursor-default"
                        : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded border text-xs ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500"
                      : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {shortcuts.map((shortcut, index) => (
              <button
                key={index}
                onClick={shortcut.action}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {shortcut.title}
              </button>
            ))}
          </div>
        </div>
        <PatientFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPatientAdded={handlePatientAdded}
        />
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
