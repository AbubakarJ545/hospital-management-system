"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../_components/SideBar";
import axios from "axios";
import EmployeeFormModel from "../_components/EmployeeFormModel";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fatchEmployees = async () => {
      const response = await axios.get("/api/employees");
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    };
    fatchEmployees();
  }, []);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(3);

  const totalRecords = employees.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = employees.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // Page number logic with ellipses
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, "...", totalPages);
      else if (currentPage >= totalPages - 2)
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      else
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

  // Handlers
  const handlePageClick = (page) => page !== "..." && setCurrentPage(page);
  const handleRecordsChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleBack = () => window.history.back();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Back Button */}
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
            + Add Employee
          </button>
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
          Employee Records
        </h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-100">
                <th className="border border-gray-300 p-2 w-12">#</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Position</th>
                <th className="border border-gray-300 p-2">Department</th>

                <th className="border border-gray-300 p-2">Contact</th>
                <th className="border border-gray-300 p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((emp, index) => (
                <tr
                  key={emp._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="border border-gray-300 p-2 text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">{emp.name}</td>
                  <td className="border border-gray-300 p-2">{emp.position}</td>
                  <td className="border border-gray-300 p-2">
                    {emp.department?.name}
                  </td>

                  <td className="border border-gray-300 p-2">{emp.phone}</td>
                  <td className="border border-gray-300 p-2">{emp.email}</td>
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

          {/* Total entries */}
          <span className="text-gray-600 text-sm">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + recordsPerPage, totalRecords)} of{" "}
            {totalRecords} entries
          </span>

          {/* Page numbers */}
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
                disabled={page === "..."}
                className={`px-3 py-1 rounded-lg border ${
                  page === currentPage
                    ? "bg-green-500 text-white"
                    : page === "..."
                    ? "bg-gray-100 text-gray-600 cursor-default"
                    : "bg-white text-green-600 border-green-300 hover:bg-green-100"
                }`}
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
        <EmployeeFormModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEmployeeAdded={(newEmployee) =>
            setEmployees([newEmployee, ...employees])
          }
        />
      </div>
    </div>
  );
};

export default Employee;
