"use client";
import React, { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import axios from "axios";

const EmployeeFormModel = ({ isOpen, onClose, onEmployeeAdded }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axios.get("/api/departments");
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    };
    fetchDepartments();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    position: "",
    department: "",
  });
  if (!isOpen) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      gender: formData.gender || undefined,
    };
    try {
      const response = await axios.post("/api/employees", payload);
      if (response.data.success) {
        alert("Employee saved successfully!");
        onEmployeeAdded?.(response.data.data);
        onClose();
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert("Failed to save Employee: " + error.response.data.error);
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("No response from server.");
      } else {
        console.error("Error:", error.message);
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-30 w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Add Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend>Personal Information:</legend>
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>
            {/* DOB & Gender */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend>Contact Details:</legend>
            {/* Phone, Email & Password */}
            <div className="flex gap-3">
              <div className="w-1/3">
                <label className="block text-sm mb-1">Phone</label>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm mb-1">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  type="email"
                />
              </div>
              <div className="w-1/3 relative">
                <label className="block text-sm mb-1">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border p-2 rounded pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
            </div>
            {/* Address */}
          </fieldset>
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend>Professional Details:</legend>

            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full border p-2 rounded pr-10"
                  required
                />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModel;
