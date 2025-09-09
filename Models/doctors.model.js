import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String, required: true }, // Changed to String for leading zeros
    email: { type: String, trim: true, lowercase: true },
    qualification: { type: String, required: true },
    experience: { type: String, trim: true },
    address: { type: String, trim: true },
    password: { type: String, required: true },
    availabilityDays: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",

      required: true,
    },
    availabilityTime: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    fee: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
export default Doctor;
