"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../_components/SideBar";
import { MdOutlinePreview, MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import DoctorFormModel from "../_components/DoctorFormModel";
import axios from "axios";
import DoctorProfile from "../_components/DoctorProfile";
import toast from "react-hot-toast";

const Doctor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/doctors");
        if (response.data.success) {
          setDoctors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  const handleDelete = async (doctorId) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await axios.delete(`/api/doctors/${doctorId}`);
      setDoctors(doctors.filter((doc) => doc._id !== doctorId));
      toast.success("Doctor deleted successfully");
    } catch (error) {
      console.error("Error deleting doctor:", error.response?.data || error);
      toast.error("Failed to delete doctor");
    }
  };
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Calculations
  const totalRecords = doctors.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = doctors.slice(startIndex, startIndex + recordsPerPage);

  // Page number logic with ellipses
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
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
    }
    return pages;
  };

  // Handlers
  const handlePageClick = (page) => {
    if (page !== "...") setCurrentPage(page);
  };
  const handleRecordsChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleBack = () => window.history.back();

  return (
    <div className="flex bg-gray-100 h-screen">
      <Sidebar />
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-gray-600">Loading doctors...</p>
        </div>
      )}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={handleBack}
            className="bg-red-300 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            ← Back
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-800 transition"
          >
            + Add Doctor
          </button>
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
          Doctor Records
        </h2>

        {/* Table */}

        <div className="overflow-x-auto text-sm">
          <table className="w-full border border-gray-300 text-left rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-green-100 text-sm">
                <th className="border border-gray-300 p-2 w-12">#</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Specialization</th>
                <th className="border border-gray-300 p-2">Experience</th>
                <th className="border border-gray-300 p-2">Contact</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Qualification</th>
                <th className="border border-gray-300 p-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((doctor, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer text-sm"
                >
                  <td className="border border-gray-300 p-2 text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {doctor.firstName} {doctor.lastName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {doctor.department?.name || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {doctor.experience}
                  </td>
                  <td className="border border-gray-300 p-2">{doctor.phone}</td>
                  <td className="border border-gray-300 p-2">{doctor.email}</td>

                  <td className="border border-gray-300 p-2">
                    {doctor.qualification}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setIsDetailsOpen(true);
                        }}
                        className=" text-black text-xl px-2 py-1 rounded hover:bg-green-100   transition"
                      >
                        <MdOutlinePreview />
                      </button>
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="text-black text-xl px-2 py-1 rounded hover:bg-green-100 transition"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        className=" text-red-600 text-xl px-2 py-1 rounded hover:bg-green-100 transition"
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          {/* Records per page */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Show</span>
            <select
              value={recordsPerPage}
              onChange={handleRecordsChange}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value={3}>3</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-gray-600 text-sm">entries</span>
          </div>

          {/* Total Entries */}
          <span className="text-gray-600 text-sm">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + recordsPerPage, totalRecords)} of{" "}
            {totalRecords} entries
          </span>

          {/* Page Numbers with Prev/Next */}
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white text-green-600 border-green-300 hover:bg-green-100"
              }`}
            >
              Prev
            </button>
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(page)}
                className={`px-3 py-1 rounded-lg border ${
                  page === currentPage
                    ? "bg-green-500 text-white"
                    : page === "..."
                    ? "bg-gray-100 text-gray-600 cursor-default"
                    : "bg-white text-green-600 border-green-300 hover:bg-green-100"
                }`}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white text-green-600 border-green-300 hover:bg-green-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
        {/* ⬇️ Put the modal HERE so it overlays only this content area */}
        <DoctorFormModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDoctorAdded={(newDoctor) => setDoctors([newDoctor, ...doctors])}
        />
        <DoctorProfile
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          doctor={selectedDoctor}
        />
      </div>
    </div>
  );
};

export default Doctor;
