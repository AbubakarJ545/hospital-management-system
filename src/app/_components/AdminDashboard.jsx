"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "./SideBar";
import axios from "axios";
import { useRouter } from "next/navigation";

const data = [
  { name: "Mon", Patient: 950, In_patient: 480 },
  { name: "Tue", Patient: 792, In_patient: 493 },
  { name: "Wed", Patient: 501, In_patient: 150 },
  { name: "Thu", Patient: 800, In_patient: 523 },
  { name: "Fri", Patient: 500, In_patient: 150 },
  { name: "Sat", Patient: 500, In_patient: 150 },
  { name: "Sun", Patient: 280, In_patient: 100 },
];

export default function AdminDashboard() {
  const [date, setDate] = useState(new Date());
  const [patients, setPatients] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axios.get("/api/patients");
      if (response.data.success) {
        setPatients(response.data.data);
      }
    };
    fetchPatients();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold text-gray-700 text-4xl">
            Welcome back, Admin 👋
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <h2 className="text-3xl font-bold text-green-600">10,525</h2>
            <p className="text-gray-500">Overall Visitors</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <h2 className="text-3xl font-bold text-green-600">
              {patients.length}
            </h2>
            <p className="text-gray-500">Total Patients</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <h2 className="text-3xl font-bold text-green-600">523</h2>
            <p className="text-gray-500">Surgeries</p>
          </div>
        </div>

        {/* Charts & Calendar */}
        <div className="grid grid-cols-3 gap-6">
          {/* Patient Statistics Chart */}
          <div className="col-span-2 bg-white p-5 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-4">Patient Statistics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Patient" fill="#16a34a" />
                <Bar dataKey="In_patient" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Real-Time Calendar */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="font-bold text-gray-700 mb-4">Calendar</h3>
            <Calendar
              onChange={setDate}
              value={date}
              className="border-none w-full"
            />
            <p className="mt-4 text-center text-green-600 font-semibold">
              {date.toDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
