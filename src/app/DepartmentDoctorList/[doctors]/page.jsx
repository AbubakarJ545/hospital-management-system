"use client";
import Navbar from "@/app/_components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { use } from "react";

export default function DoctorList({ params }) {
  const { doctors: departmentId } = use(params);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!departmentId) return;
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/departments/${departmentId}`);
        if (response.data.success) {
          setDoctors(response.data.doctors);
          // Set department name from first doctor's department info
          if (response.data.doctors.length > 0) {
            setDepartment(response.data.doctors[0].department);
          }
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [departmentId]);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const doctorName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const specialization = doctor.specialization?.toLowerCase() || '';
    const qualification = doctor.qualification?.toLowerCase() || '';
    
    return (
      doctorName.includes(searchLower) ||
      specialization.includes(searchLower) ||
      qualification.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading doctors...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (doctors.length === 0) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Doctors Found</h2>
              <p className="text-gray-600 mb-6">No doctors are currently available in this department.</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 mb-6 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Departments
            </button>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-6xl mb-4">🏥</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {department?.name || 'Department'} Doctors
              </h1>
              <p className="text-gray-600 text-lg">
                Meet our experienced medical professionals
              </p>
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Available
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search doctors by name, specialization, or qualification..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                {/* Doctor Image/Icon Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">👨‍⚕️</div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Consultation Fee</div>
                      <div className="text-xl font-bold">PKR {doctor.fee}/-</div>
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm">{doctor.qualification}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm">{doctor.specialization}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{doctor.experience} years experience</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{doctor.email}</span>
                    </div>
                  </div>

                  {/* Availability Days */}
                  {doctor.availabilityDays?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Days:</h4>
                      <div className="flex flex-wrap gap-1">
                        {doctor.availabilityDays.map((day, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timing */}
                  {doctor.availabilityTime?.start && doctor.availabilityTime?.end && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">
                          {doctor.availabilityTime.start} - {doctor.availabilityTime.end}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredDoctors.length === 0 && searchTerm && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Doctors Found</h3>
              <p className="text-gray-600 mb-4">No doctors match your search for "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
