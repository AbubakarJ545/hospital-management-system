"use client";
import React, { useRef } from "react";

const PatientPrintModal = ({ isOpen, onClose, patient }) => {
  const printRef = useRef();

  if (!isOpen || !patient) return null;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US");
  const currentDate = new Date().toLocaleDateString("en-US");

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative">
        <div ref={printRef}>
          {/* Hospital Logo & Name */}
          <div className="flex flex-row items-center justify-center gap-4 mb-4 text-center">
            <img
              src={typeof window !== "undefined" ? "/logo.png" : ""}
              alt="Hospital Logo"
              className="w-20 h-20 object-contain"
              onError={(e) => (e.target.style.display = "none")} // Hide if image missing
            />
            <h1 className="text-2xl font-bold">Jamal Hospital</h1>
          </div>

          <h1 className="text-center font-bold text-xl mb-4">
            PATIENT INFORMATION SHEET
          </h1>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-semibold">Patient Name:</span>{" "}
              {patient.firstName} {patient.lastName}
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span>{" "}
              {formatDate(patient.dob)}
            </p>
            <p>
              <span className="font-semibold">Age:</span>{" "}
              {new Date().getFullYear() - new Date(patient.dob).getFullYear()}
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {patient.gender}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {patient.address}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {patient.phone}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {patient.email}
            </p>
            <p>
              <span className="font-semibold">Marital Status:</span>{" "}
              {patient.maritalStatus}
            </p>
            <p>
              <span className="font-semibold">Department:</span>{" "}
              {patient.departmentId?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Emergency Contact:</span>{" "}
              {patient.emergencyContact}
            </p>
            <p>
              <span className="font-semibold">Blood Group:</span>{" "}
              {patient.bloodGroup}
            </p>
            <p>
              <span className="font-semibold">Insurance Provider:</span>{" "}
              {patient.insuranceProvider}
            </p>
            <p>
              <span className="font-semibold">Insurance Number:</span>{" "}
              {patient.insuranceNumber}
            </p>
            <p>
              <span className="font-semibold">Allergies:</span>{" "}
              {patient.allergies}
            </p>
            <p>
              <span className="font-semibold">Medical History:</span>{" "}
              {patient.medicalHistory}
            </p>
            <p>
              <span className="font-semibold">Height:</span> {patient.height} ft
            </p>
            <p>
              <span className="font-semibold">Weight:</span> {patient.weight} kg
            </p>
            <p>
              <span className="font-semibold">Appointment Date:</span>{" "}
              {formatDate(patient.appointmentDate)}
            </p>
            <p>
              <span className="font-semibold">Appointment Time:</span>{" "}
              {patient.appointmentTime}
            </p>
            <p>
              <span className="font-semibold">Disease:</span> {patient.disease}
            </p>
          </div>

          <p className="mt-4 text-xs text-gray-600">
            I DO HEREBY ASSIGN all insurance benefits to be paid directly to the
            facility...
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <p>
              Signature of Patient / Parent if Minor: _______________________
            </p>
            <p>Date: {currentDate}</p>
            <p>Signature of Responsible Party: _______________________</p>
            <p>Date: {currentDate}</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientPrintModal;
