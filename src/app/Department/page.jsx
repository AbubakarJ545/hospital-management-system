"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../_components/SideBar";
import DepartmentForm from "../_components/DepartmentForm";
import DepartmentsModel from "../../../Models/departments.model";
import axios from "axios";
import { useRouter } from "next/navigation";

const DepartmentPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();

  const departmentImages = [
    {
      name: "Cardiology",
      image: "/card.jpg",
    },
    {
      name: "Neurology",
      image: "/neurology.png",
    },
    {
      name: "Orthopedics",
      image: "/Orthopedics.jpg",
    },
    {
      name: "Pediatrics",
      image: "/Pediatrics.jpg",
    },
    {
      name: "Radiology",
      image: "/Radiology.jpeg",
    },
    {
      name: "Oncology",
      image: "/Oncology.jpg",
    },
    {
      name: "Emergency",
      image: "/Emergency.jpg",
    },
    {
      name: "Dermatology",
      image: "/Dermatology.jpg",
    },
    {
      name: "Psychiatry",
      image: "/Psychiatry.jpg",
    },
    {
      name: "Gastroenterology",
      image: "/Gastroenterology.jpg",
    },
    {
      name: "Anesthesiology",
      image: "/Anesthesiology.jpg",
    },
    { name: "ENT", image: "/ENT.jpg" },
    { name: "Supporting Staff", image: "/ss.webp" },
  ];
  const getDepartmentImage = (name) => {
    const dept = departmentImages.find((d) => d.name === name);
    return dept ? dept.image : "/logo.jpg"; // fallback image
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/departments");
        if (response.data.success) {
          setDepartmentsData(response.data.data);
        }
      } catch (error) {
        console.error(
          "Error fetching Departments",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);
  const handleBack = () => window.history.back();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading Departments...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto relative">
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-red-300 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer"
          >
            Add Department
          </button>
          <button
            onClick={handleBack}
            className="bg-red-300 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            ← Back
          </button>
        </div>

        {/* Page Title */}
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          Hospital Departments
        </h2>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {departmentsData.map((dept, index) => (
            <div
              onClick={() => router.push(`/DepartmentDoctorList/${dept._id}`)}
              key={index}
              className="p-4 border rounded shadow hover:shadow-lg hover:bg-amber-50 transition bg-white cursor-pointer"
            >
              <img
                src={getDepartmentImage(dept.name)}
                alt={dept.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {dept.name}
              </h2>
              <p className="text-gray-600 mt-1">{dept.description}</p>
            </div>
          ))}
        </div>
        <DepartmentForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onDepartmentAdded={(newDepartment) =>
            setDepartmentsData([newDepartment, ...departmentsData])
          }
        />
      </div>
    </div>
  );
};

export default DepartmentPage;
