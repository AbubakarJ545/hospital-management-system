// "use client";

// import { useState } from "react";

// export default function Hero({ onBookAppointment, onSearchDoctor }) {
//   const [search, setSearch] = useState("");

//   const handleSearch = () => {
//     if (onSearchDoctor) {
//       onSearchDoctor(search); // call parent handler
//     }
//   };

//   return (
//     <section className="bg-red-50 pt-28 pb-16">
//       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
//         {/* Text Content */}
//         <div className="flex-1 text-center md:text-left">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Welcome to <span className="text-red-600">Jamal Hospital</span>
//           </h1>
//           <p className="text-lg text-gray-700 mb-6">
//             Trusted healthcare with experienced doctors and modern technology,
//             serving you 24/7 with care and compassion.
//           </p>

//           {/* Buttons + Search */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
//             <button
//               onClick={onBookAppointment}
//               className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
//             >
//               Book an Appointment
//             </button>

//             {/* Search Box */}
//             <div className="flex w-full sm:w-auto">
//               <input
//                 type="text"
//                 placeholder="Search doctors..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64"
//               />
//               <button
//                 onClick={handleSearch}
//                 className="bg-red-600 text-white px-4 py-3 rounded-r-lg shadow hover:bg-red-700 transition"
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Image */}
//         <div className="flex-1 mt-10 md:mt-0">
//           <img
//             src="/doctor.jpg"
//             alt="Jamal Hospital"
//             className="w-full rounded-lg shadow-lg"
//           />
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";
import React, { useState } from "react";
import axios from "axios";
import DoctorProfile from "./DoctorProfile";
import PatientFormModal from "./PatientFormModal";
import ReceiptModal from "./ReceiptModal";

export default function Hero() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [preselectedDoctor, setPreselectedDoctor] = useState(null);
  const [recentReceipt, setRecentReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length >= 2) {
      try {
        const res = await axios.get(`/api/doctors?search=${value}`);
        if (res.data.success) {
          setResults(res.data.data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Error searching doctors:", error);
      }
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSearch("");
    setResults([]);
    setShowDropdown(false);
    setSelectedDoctor(doctor);
    setIsProfileOpen(true);
  };

  const handleBookAppointment = (doctor) => {
    setPreselectedDoctor(doctor);
    setIsProfileOpen(false);
    setIsPatientModalOpen(true);
  };

  const handlePatientAdded = (newPatient) => {
    setIsPatientModalOpen(false);
    setPreselectedDoctor(null);
    setRecentReceipt(newPatient);
    setShowReceipt(true);
  };

  return (
    <section className="bg-red-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-red-600">Jamal Hospital</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Trusted healthcare with experienced doctors and modern technology,
            serving you 24/7 with care and compassion.
          </p>

          {/* Search Box */}
          <div className="relative mb-4">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search doctors..."
              className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {showDropdown && results.length > 0 && (
              <ul className="absolute left-0 w-full md:w-96 bg-white border mt-1 rounded-lg shadow max-h-60 overflow-y-auto z-50">
                {results.map((doctor) => (
                  <li
                    key={doctor._id}
                    onClick={() => handleSelectDoctor(doctor)}
                    className="px-4 py-2 hover:bg-red-100 cursor-pointer"
                  >
                    {doctor.firstName} {doctor.lastName}{" "}
                    <span className="text-gray-500 text-sm">
                      ({doctor.department?.name})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Book Appointment Button */}
          <button
            onClick={() => {
              setPreselectedDoctor(null);
              setIsPatientModalOpen(true);
            }}
            className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
          >
            Book an Appointment
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 mt-10 md:mt-0">
          <img
            src="/doctor.jpg"
            alt="Jamal Hospital"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      {/* Doctor Profile Modal */}
      <DoctorProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        doctor={selectedDoctor}
        onBookAppointment={handleBookAppointment}
      />
      
      {/* Patient Form Modal */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => {
          setIsPatientModalOpen(false);
          setPreselectedDoctor(null);
        }}
        onPatientAdded={handlePatientAdded}
        preselectedDoctor={preselectedDoctor}
      />

      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        appointment={recentReceipt}
      />
    </section>
  );
}
