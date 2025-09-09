import React, { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import TimePicker from "react-time-picker";
import axios from "axios";
import toast from "react-hot-toast";

const DoctorFormModel = ({ isOpen, onClose, onDoctorAdded }) => {
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
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    qualification: "",
    password: "",
    address: "",
    specialization: "",
    experience: "",
    availabilityDays: [],
    availabilityTime: { start: "", end: "" },
    fee: "",
    departmentId: "",
  });
  if (!isOpen) return null;

  const handleDaysChange = (day) => {
    setFormData((prev) => {
      if (prev.availabilityDays.includes(day)) {
        return {
          ...prev,
          availabilityDays: prev.availabilityDays.filter((d) => d !== day),
        };
      } else {
        return { ...prev, availabilityDays: [...prev.availabilityDays, day] };
      }
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      dob: formData.dob ? new Date(formData.dob) : undefined,
      gender: formData.gender || undefined,
    };
    try {
      const response = await axios.post("/api/doctors", payload);
      if (response.data.success) {
        toast.success("Doctor saved successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          dob: "",
          gender: "",
          phone: "",
          email: "",
          qualification: "",
          password: "",
          address: "",
          specialization: "",
          experience: "",
          availabilityDays: [],
          availabilityTime: { start: "", end: "" },
          fee: "",
          departmentId: "",
        });

        onDoctorAdded?.(response.data.data);
        onClose();
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert("Failed to save Doctor: " + error.response.data.error);
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
        <h2 className="text-xl font-bold mb-4 text-center">Add Doctor</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend>Personal Information:</legend>
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm mb-1">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>
            {/* DOB & Gender */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
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
            <div>
              <label className="block text-sm mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows={2}
              />
            </div>
          </fieldset>
          <fieldset className="border border-gray-300 rounded-lg p-4">
            <legend>Professional Details:</legend>

            <div className="flex gap-3">
              <div className="w-1/3">
                <label className="block text-sm mb-1">Qualification</label>
                <input
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm mb-1">Experience:</label>
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm mb-1">Consultation Fee:</label>
                <input
                  name="fee"
                  value={formData.fee || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mb-3">
                <label className="block mb-1">Availability Days:</label>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label key={day} className="mr-3">
                    <input
                      type="checkbox"
                      checked={formData.availabilityDays.includes(day)}
                      onChange={() => handleDaysChange(day)}
                    />{" "}
                    {day}
                  </label>
                ))}
              </div>
              <div className="mb-3">
                <label className="block mb-1">Availability Time:</label>
                <div className="flex gap-2">
                  <TimePicker
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        availabilityTime: {
                          ...prev.availabilityTime,
                          start: value || "",
                        },
                      }))
                    }
                    value={formData.availabilityTime.start || ""}
                    disableClock
                    clearIcon={null}
                    className="border rounded p-1 w-1/2"
                  />
                  <TimePicker
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        availabilityTime: {
                          ...prev.availabilityTime,
                          end: value || "",
                        },
                      }))
                    }
                    value={formData.availabilityTime.end || ""}
                    disableClock
                    clearIcon={null}
                    className="border rounded p-1 w-1/2"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm mb-1">Department</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
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

export default DoctorFormModel;
