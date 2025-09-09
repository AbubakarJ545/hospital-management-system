"use client";
import React, { useState } from "react";
import axios from "axios";

const DepartmentForm = ({ isOpen, onClose, onDepartmentAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/departments", formData);
      if (res.data.success) {
        setMessage("Department saved successfully!");
        setFormData({ name: "", description: "" });
        onDepartmentAdded(res.data.data);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-green-600 text-center">
          Add Department
        </h2>

        {message && (
          <p className="text-center text-sm text-red-500 mb-2">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Department Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Department Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-300"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            {loading ? "Saving..." : "Save Department"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
