"use client";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  });
  const router = useRouter();

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      const parsedDoctor = JSON.parse(storedDoctor);
      setDoctor(parsedDoctor);
      fetchPatients(parsedDoctor.id);
      
      // Set up periodic refresh every 10 seconds to show new patients
      const interval = setInterval(() => {
        fetchPatients(parsedDoctor.id);
      }, 10000);
      
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    } else {
      setLoading(false); // finished checking auth
    }
  }, []);

  const fetchPatients = async (doctorId) => {
    try {
      const response = await axios.get(`/api/patients?doctorId=${doctorId}`);
      
      if (response.data.success) {
        const patientsWithStatus = response.data.data.map((p) => ({
          ...p,
          checked: p.checked || false,
        }));
        setPatients(patientsWithStatus);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPatient = async (id) => {
    try {
    setPatients((prev) =>
      prev.map((p) => (p._id === id ? { ...p, checked: true } : p))
    );

      const response = await axios.put(`/api/patients/${id}/check`, {
        checked: true,
      });

      if (!response.data.success) {
        setPatients((prev) =>
          prev.map((p) => (p._id === id ? { ...p, checked: false } : p))
        );
        console.error("Failed to update patient status");
      }
    } catch (error) {
      setPatients((prev) =>
        prev.map((p) => (p._id === id ? { ...p, checked: false } : p))
      );
      console.error("Error updating patient status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    router.push("/");
  };

  const handleBack = () => window.history.back();

  // Calendar helpers
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const getCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Get appointments for selected date (defaults to tomorrow)
  const selectedDateAppointments = useMemo(() => {
    const selectedStr = selectedDate.toISOString().split('T')[0];
    return patients.filter((p) => {
      if (!p.appointmentDate) return false;
      const apptDate = new Date(p.appointmentDate);
      const apptStr = apptDate.toISOString().split('T')[0];
      return apptStr === selectedStr;
    }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  }, [patients, selectedDate]);

  // Get next day appointments for default display
  const nextDayAppointments = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return patients.filter((p) => {
      if (!p.appointmentDate) return false;
      const apptDate = new Date(p.appointmentDate);
      const apptStr = apptDate.toISOString().split('T')[0];
      return apptStr === tomorrowStr;
    }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  }, [patients]);

  const getAppointmentsForDate = (date) => {
    const dateStr = formatDate(date);
    return patients.filter((p) => {
      if (!p.appointmentDate) return false;
      const apptStr = formatDate(new Date(p.appointmentDate));
      return apptStr === dateStr;
    });
  };

  // Helpers for weekday filtering
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const getDayNameFromDate = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;
    return dayNames[date.getDay()];
  };

  const filteredByDay = useMemo(() => {
    return patients.filter((p) => getDayNameFromDate(p.appointmentDate) === selectedDay);
  }, [patients, selectedDay]);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // Split into upcoming (today and future time inclusive) and past (strictly before today)
  const { upcomingPatients, pastPatients } = useMemo(() => {
    const upcoming = [];
    const past = [];
    for (const p of filteredByDay) {
      const appt = p.appointmentDate ? new Date(p.appointmentDate) : null;
      if (!appt || isNaN(appt.getTime())) continue;
      if (appt >= startOfToday) {
        upcoming.push(p);
      } else {
        past.push(p);
      }
    }
    // Sort for better UX: upcoming ascending by date/time, past descending
    upcoming.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    past.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    return { upcomingPatients: upcoming, pastPatients: past };
  }, [filteredByDay, startOfToday]);

  // Today's appointments (always show today's date)
  const todayAppointments = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return patients.filter((p) => {
      if (!p.appointmentDate) return false;
      const apptDate = new Date(p.appointmentDate);
      const apptStr = apptDate.toISOString().split('T')[0];
      return apptStr === todayStr;
    });
  }, [patients]);


  // Persisted earnings: compute from checked patients coming from DB
  const checkedCount = useMemo(() => patients.filter((p) => p.checked).length, [patients]);
  const consultationFee = Number(doctor?.fee) || 0;
  const earnings = checkedCount * consultationFee;

  // Guard renders
  if (!loading && !doctor) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-lg text-gray-700 font-semibold">
          Please login first to access Doctor Dashboard.
        </p>
        <button
          onClick={handleBack}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading doctor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <div className="flex top-6 right-6 gap-2 z-10">
        <button
          onClick={handleBack}
          className="bg-red-300 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
        >
          ← Back
        </button>
      </div>

      {/* Welcome Header */}
      <div className="bg-blue-600 text-white text-center py-4 rounded-2xl text-2xl font-bold shadow">
        Welcome, {doctor.fName} {doctor.lName}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Today's Appointments */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Today's Appointments</h2>

          {todayAppointments.length > 0 ? (
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border border-gray-300">Sr No</th>
                  <th className="p-2 border border-gray-300">Time</th>
                  <th className="p-2 border border-gray-300">Patient Name</th>
                  <th className="p-2 border border-gray-300">Status</th>
                  <th className="p-2 border border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((p, index) => (
                  <tr key={p._id} className={`text-center ${p.checked ? "bg-green-100" : ""}`}>
                    <td className="p-2 border border-gray-300">{index + 1}</td>
                    <td className="p-2 border border-gray-300">{p.appointmentTime || "-"}</td>
                    <td className="p-2 border border-gray-300">{p.firstName} {p.lastName}</td>
                    <td className="p-2 border border-gray-300">{p.checked ? <span className="text-green-600 font-semibold">✔ Checked</span> : <span className="text-red-500">Pending</span>}</td>
                    <td className="p-2 border border-gray-300">
                      <button
                        onClick={() => handleCheckPatient(p._id)}
                        disabled={p.checked}
                        className={`px-3 py-1 rounded text-white ${p.checked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                      >
                        {p.checked ? "Viewed" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mb-6">No appointments for today.</p>
          )}

          {/* Selected Date Appointments (defaults to tomorrow) */}
          {selectedDateAppointments.length > 0 && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Appointments for {selectedDate.toLocaleDateString()}
              </h3>
              <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border border-gray-300">Sr No</th>
                    <th className="p-2 border border-gray-300">Time</th>
                    <th className="p-2 border border-gray-300">Patient Name</th>
                    <th className="p-2 border border-gray-300">Status</th>
                    <th className="p-2 border border-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDateAppointments.map((p, index) => (
                    <tr key={p._id} className={`text-center ${p.checked ? "bg-green-100" : ""}`}>
                      <td className="p-2 border border-gray-300">{index + 1}</td>
                      <td className="p-2 border border-gray-300">{p.appointmentTime || "-"}</td>
                      <td className="p-2 border border-gray-300">{p.firstName} {p.lastName}</td>
                      <td className="p-2 border border-gray-300">{p.checked ? <span className="text-green-600 font-semibold">✔ Checked</span> : <span className="text-red-500">Pending</span>}</td>
                      <td className="p-2 border border-gray-300">
                        <button
                          onClick={() => handleCheckPatient(p._id)}
                          disabled={p.checked}
                          className={`px-3 py-1 rounded text-white ${p.checked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                          {p.checked ? "Viewed" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedDateAppointments.length === 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">No appointments for {selectedDate.toLocaleDateString()}.</p>
            </div>
          )}

          {/* Weekday Filter Section */}
        
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="text-lg font-semibold mb-3">Profile Details</h2>
          <p>Email: {doctor.email}</p>
          <p>Patients Checked: {checkedCount}</p>
          <p>
            Earnings: <span className="font-bold text-green-600">Rs. {earnings}</span>
          </p>
          <p>Rating: ★★★★☆</p>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>

          {/* Calendar - Always Visible */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Appointment Calendar</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    →
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {getCalendarDays().map((date, index) => {
                  const appointments = getAppointmentsForDate(date);
                  const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                  const isSelected = formatDate(date) === formatDate(selectedDate);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`p-2 text-sm rounded transition ${
                        !isCurrentMonth 
                          ? 'text-gray-300' 
                          : isSelected 
                            ? 'bg-blue-600 text-white' 
                            : isToday(date)
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-200'
                      }`}
                    >
                      <div>{date.getDate()}</div>
                      {appointments.length > 0 && (
                        <div className="text-xs text-center">
                          <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Appointments */}
            {selectedDateAppointments.length > 0 && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold mb-3">
                  Appointments for {selectedDate.toLocaleDateString()}
                </h4>
                <div className="space-y-2">
                  {selectedDateAppointments.map((p, index) => (
                    <div key={p._id} className={`p-2 rounded border ${p.checked ? "bg-green-100" : "bg-white"}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{p.firstName} {p.lastName}</span>
                          <span className="text-sm text-gray-600 ml-2">({p.appointmentTime || "No time"})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${p.checked ? "text-green-600" : "text-red-500"}`}>
                            {p.checked ? "✔ Checked" : "Pending"}
                          </span>
                          <button
                            onClick={() => handleCheckPatient(p._id)}
                            disabled={p.checked}
                            className={`px-2 py-1 rounded text-white text-sm ${p.checked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                          >
                            {p.checked ? "Viewed" : "View"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDateAppointments.length === 0 && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">No appointments for {selectedDate.toLocaleDateString()}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
