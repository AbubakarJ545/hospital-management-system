"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../_components/SideBar";
import PatientFormModal from "../_components/PatientFormModal";
import axios from "axios";
import PatientDetailsModal from "../_components/PatientDetailsModal";

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    date: '',
    doctorId: '',
    departmentId: ''
  });
  
  // Data for filter options
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsRes, doctorsRes, departmentsRes] = await Promise.all([
          axios.get("/api/patients"),
          axios.get("/api/doctors"),
          axios.get("/api/departments")
        ]);

        if (patientsRes.data.success) {
          setPatients(patientsRes.data.data);
          setFilteredPatients(patientsRes.data.data);
        }
        
        if (doctorsRes.data.success) {
          setDoctors(doctorsRes.data.data);
        }
        
        if (departmentsRes.data.success) {
          setDepartments(departmentsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic
  useEffect(() => {
    let filtered = [...patients];

    // Filter by date
    if (filters.date) {
      const filterDate = new Date(filters.date).toISOString().split('T')[0];
      filtered = filtered.filter(patient => {
        if (!patient.appointmentDate) return false;
        const patientDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
        return patientDate === filterDate;
      });
    }

    // Filter by doctor
    if (filters.doctorId) {
      filtered = filtered.filter(patient => 
        patient.doctorId && patient.doctorId._id === filters.doctorId
      );
    }

    // Filter by department
    if (filters.departmentId) {
      filtered = filtered.filter(patient => 
        patient.departmentId && patient.departmentId._id === filters.departmentId
      );
    }

    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [patients, filters]);

  const totalRecords = filteredPatients.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredPatients.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) for (let i = 1; i <= totalPages; i++) pages.push(i);
    else if (currentPage <= 3) pages.push(1, 2, "...", totalPages);
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
    return pages;
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handleRecordsChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleBack = () => window.history.back();

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      doctorId: '',
      departmentId: ''
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 text-sm">
      <Sidebar />

      <div className="flex-1 p-4 overflow-y-auto relative">
        <div className="absolute top-4 right-4 flex gap-2 z-10 text-sm">
          <button
            onClick={handleBack}
            className="bg-blue-300 text-white px-2 py-1 rounded-md hover:bg-red-600 transition text-sm"
          >
            Back
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-800 transition text-sm"
          >
            Add Patient
          </button>
        </div>

        <h2 className="text-xl font-bold text-green-600 mb-2 text-center mt-12">
          Patient Records
        </h2>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Department
              </label>
              <select
                value={filters.departmentId}
                onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Doctor
              </label>
              <select
                value={filters.doctorId}
                onChange={(e) => handleFilterChange('doctorId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Doctors</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
              <div className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm">
                {totalRecords} patients found
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full border border-gray-300 text-left rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-green-100 text-xs">
                <th className="border p-1 w-10">#</th>
                <th className="border p-1">Name</th>
                <th className="border p-1">Age</th>
                <th className="border p-1">Department</th>
                <th className="border p-1">Doctor</th>
                <th className="border p-1">Appointment Date</th>
                <th className="border p-1">Gender</th>
                <th className="border p-1">Contact</th>
                <th className="border p-1">Email</th>
                <th className="border p-1">Address</th>
                <th className="border p-1">Blood Group</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center p-3 text-xs">
                    Loading patients...
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      setSelectedPatient(p);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <td className="border p-1 text-center">
                      {startIndex + i + 1}
                    </td>
                    <td className="border p-1">
                      {p.firstName} {p.lastName}
                    </td>
                    <td className="border p-1">
                      {new Date().getFullYear() - new Date(p.dob).getFullYear()}
                    </td>
                    <td className="border p-1">
                      {p.departmentId?.name || "N/A"}
                    </td>
                    <td className="border p-1">
                      {p.doctorId ? `${p.doctorId.firstName} ${p.doctorId.lastName}` : "N/A"}
                    </td>
                    <td className="border p-1">
                      {p.appointmentDate ? new Date(p.appointmentDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="border p-1">{p.gender}</td>
                    <td className="border p-1">{p.phone}</td>
                    <td className="border p-1">{p.email}</td>
                    <td className="border p-1">{p.address}</td>
                    <td className="border p-1">{p.bloodGroup}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center p-3 text-xs">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Show</span>
            <select
              value={recordsPerPage}
              onChange={handleRecordsChange}
              className="border rounded-md px-1 py-1 text-xs"
            >
              <option value={3}>3</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-600">entries</span>
          </div>

          <span className="text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + recordsPerPage, totalRecords)} of{" "}
            {totalRecords} entries
          </span>

          <div className="flex gap-1 items-center">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded-md border text-xs ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white text-green-600 border-green-300 hover:bg-green-100"
              }`}
            >
              Prev
            </button>
            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                onClick={() => page !== "..." && setCurrentPage(page)}
                className={`px-2 py-1 rounded-md border text-xs ${
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
              className={`px-2 py-1 rounded-md border text-xs ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white text-green-600 border-green-300 hover:bg-green-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Modals */}
        <PatientFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPatientAdded={(newPatient) =>
            setPatients([newPatient, ...patients])
          }
        />
        <PatientDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          patient={selectedPatient}
        />
      </div>
    </div>
  );
};

export default Patient;
