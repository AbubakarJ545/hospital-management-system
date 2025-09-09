import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "receptionist", "accountant", "employee"],
      default: "employee",
    },
    permissions: {
      type: [String],
      default: [],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",

      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
