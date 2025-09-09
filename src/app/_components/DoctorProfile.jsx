"use client";
import React from "react";

const DoctorProfile = ({ isOpen, onClose, doctor, onBookAppointment }) => {
  if (!isOpen || !doctor) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 overflow-auto p-3"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full rounded-2xl shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white text-xl font-bold bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={doctor.image || "/doctorimg.webp"}
                alt="Doctor"
                className="w-24 h-24 rounded-xl object-cover border-2 border-white/40 shadow"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                Available
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {doctor.firstName} {doctor.lastName}
              </h1>
              <p className="text-blue-100 text-sm mb-2">
                {doctor.department?.name || doctor.department}
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="bg-white/20 p-1 rounded">📞</span>
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="bg-white/20 p-1 rounded">📧</span>
                  <span>{doctor.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="bg-blue-50 p-4 rounded-xl border text-sm">
              <h3 className="font-semibold mb-1">🎓 Qualification</h3>
              <p className="text-gray-600">{doctor.qualification || "N/A"}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border text-sm">
              <h3 className="font-semibold mb-1">💼 Experience</h3>
              <p className="text-gray-600">{doctor.experience || "N/A"}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border text-sm">
              <h3 className="font-semibold mb-1">💰 Fee</h3>
              <p className="text-gray-600">Rs. {doctor.fee || "N/A"}</p>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-orange-50 p-4 rounded-xl border mb-5 text-sm">
            <h3 className="font-semibold mb-2">📅 Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-gray-700 font-medium text-xs">Days</p>
                <div className="flex flex-wrap gap-1">
                  {doctor.availabilityDays?.length > 0 ? (
                    doctor.availabilityDays.map((day, i) => (
                      <span
                        key={i}
                        className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full text-[11px]"
                      >
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-700 font-medium text-xs">Time</p>
                <p className="text-gray-600">
                  {doctor.availabilityTime?.start &&
                  doctor.availabilityTime?.end
                    ? `${doctor.availabilityTime.start} - ${doctor.availabilityTime.end}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          {doctor.address && (
            <div className="bg-gray-50 p-4 rounded-xl border mb-5 text-sm">
              <h3 className="font-semibold mb-1">📍 Address</h3>
              <p className="text-gray-600">{doctor.address}</p>
            </div>
          )}

          {/* Book Appointment */}
          <div className="flex justify-center">
            <button
              onClick={() => onBookAppointment && onBookAppointment(doctor)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl font-medium text-sm shadow hover:scale-105 transition"
            >
              📅 Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
