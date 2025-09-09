
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    emergencyContact: { type: String, trim: true },

    // Medical Information
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    insuranceProvider: { type: String, trim: true },
    insuranceNumber: { type: String, trim: true },
    allergies: { type: String, trim: true },
    medicalHistory: { type: String, trim: true },
    height: { type: Number },
    weight: { type: Number },

    // Appointment: Store exact date+time
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String }, 

    disease: { type: String, trim: true },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    checked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Patient ||
  mongoose.model("Patient", patientSchema);
