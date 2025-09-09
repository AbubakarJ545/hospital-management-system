"use client";
import React from "react";

export default function DoctorList() {
  if (doctors.length === 0) {
    return (
      <div className="text-center mt-5 text-gray-600">
        No doctors found for this department.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {doctors.map((doctor) => (
        <div
          key={doctor._id}
          className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
          <p className="text-gray-600">{doctor.specialization}</p>
          <p className="text-gray-600">{doctor.email}</p>
          <p className="text-gray-600">Department: {doctor.department.name}</p>
          <p className="text-gray-500 text-sm">
            Experience: {doctor.experience} years
          </p>

          {/* Availability Days */}
          {doctor.availabilityDays?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {doctor.availabilityDays.map((day, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                >
                  {day}
                </span>
              ))}
            </div>
          )}

          {/* Timing */}
          {doctor.timing && (
            <p className="mt-2 text-sm text-blue-600 font-medium">
              Timing: {doctor.timing}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
