import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PatientFormModal = ({
  isOpen,
  onClose,
  onPatientAdded,
  preselectedDoctor = null,
}) => {
  const [departments, setDepartments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    maritalStatus: "",
    emergencyContact: "",
    departmentId: "",
    doctorId: "",
    disease: "",
    bloodGroup: "",
    insuranceProvider: "",
    insuranceNumber: "",
    allergies: "",
    medicalHistory: "",
    height: "",
    weight: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchDepartmentsAndDoctor = async () => {
      const [departmentsRes, doctorsRes] = await Promise.all([
        axios.get("/api/departments"),
        axios.get("/api/doctors"),
      ]);

      if (departmentsRes.data.success && doctorsRes.data.success) {
        setDepartments(departmentsRes.data.data);
        setAllDoctors(doctorsRes.data.data);
      }
    };
    fetchDepartmentsAndDoctor();
  }, []);

  // Handle preselected doctor
  useEffect(() => {
    if (preselectedDoctor && isOpen) {
      setFormData((prev) => ({
        ...prev,
        departmentId:
          preselectedDoctor.department?._id || preselectedDoctor.department,
        doctorId: preselectedDoctor._id,
      }));

      // Filter doctors for the selected department
      const filtered = allDoctors.filter(
        (doctor) =>
          doctor.department?._id === preselectedDoctor.department?._id ||
          doctor.department === preselectedDoctor.department
      );
      setFilteredDoctors(filtered);
    }
  }, [preselectedDoctor, isOpen, allDoctors]);

  if (!isOpen) return null;

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });

  //   // If department changes, filter doctors
  //   if (name === "departmentId") {
  //     const filtered = allDoctors.filter(
  //       (doctor) =>
  //         doctor.departmentId === value || doctor.department?._id === value
  //     );
  //     setFilteredDoctors(filtered);
  //     setFormData((prev) => ({ ...prev, doctorId: "" }));
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If department changes → filter doctors
    if (name === "departmentId") {
      const filtered = allDoctors.filter(
        (doctor) =>
          doctor.departmentId === value || doctor.department?._id === value
      );
      setFilteredDoctors(filtered);
      setFormData((prev) => ({ ...prev, doctorId: "" }));
      setSelectedDoctor(null); // reset selected doctor when department changes
    }

    // If doctor changes → set selectedDoctor
    if (name === "doctorId") {
      const doctor = allDoctors.find((d) => d._id === value);
      setSelectedDoctor(doctor || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDoctor?.availabilityTime) {
      const { start, end } = selectedDoctor.availabilityTime;
      const patientTime = formData.appointmentTime;
      if (patientTime) {
        if (patientTime < start || patientTime > end) {
          toast.error(
            `Doctor is available from ${start} to ${end}. Please select a valid time.`
          );
          return;
        }
      }
    }
    const payload = {
      ...formData,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
    };

    try {
      const response = await axios.post("/api/patients", payload);
      if (response.data.success) {
        toast.success("Patient Saved Successfully");
        onPatientAdded?.(response.data.data);
        onClose();
      }
    } catch (error) {
      let message = "Something went wrong.";
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(`Failed to save patient: ${message}`);
    }
    setFormData({
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      maritalStatus: "",
      emergencyContact: "",
      departmentId: "",
      doctorId: "",
      disease: "",
      bloodGroup: "",
      insuranceProvider: "",
      insuranceNumber: "",
      allergies: "",
      medicalHistory: "",
      height: "",
      weight: "",
      appointmentDate: "",
      appointmentTime: "",
    });
  };

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-6 mt-20"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative z-30 w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Add Patient</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name Row */}
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

          {/* Phone & Email */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                type="email"
              />
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

          {/* Department */}
          <div>
            <label className="block text-sm mb-1">Department</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="w-1/2">
            <label className="block text-sm mb-1">Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select</option>
              {filteredDoctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.firstName} {d.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Marital Status & Emergency Contact */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Marital Status</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1">Emergency Contact</label>
              <input
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Blood Group & Insurance */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                {bloodGroups.map((bg, i) => (
                  <option key={i} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1">Insurance Provider</label>
              <input
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Insurance Number */}
          <div>
            <label className="block text-sm mb-1">Insurance Number</label>
            <input
              name="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Allergies & Medical History */}
          <div>
            <label className="block text-sm mb-1">Allergies</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Medical History</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={2}
            />
          </div>

          {/* Height & Weight */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Height (cm)</label>
              <input
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1">Weight (kg)</label>
              <input
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Appointment Date & Time */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm mb-1">
                Preferred Appointment Date
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1">
                Preferred Appointment Time
              </label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Disease */}
          <div>
            <label className="block text-sm mb-1">Disease / Problem</label>
            <input
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="e.g., Ear Infection, Heart Issue"
            />
          </div>

          {/* Buttons */}
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

export default PatientFormModal;
