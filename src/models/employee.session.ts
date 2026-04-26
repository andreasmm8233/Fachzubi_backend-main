import mongoose, { Schema, model, type Document } from "mongoose";

export interface EmployeeSession {
  employeeId: mongoose.Schema.Types.ObjectId;
  isValidSession?: boolean;
  ipAddress: string;
  userAgent: string;
}

export interface EmployeeSessionDocument extends EmployeeSession, Document {
  createdAt: Date;
  updatedAt: Date;
}

const employeeSessionSchema = new Schema<EmployeeSessionDocument>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employee",
    },
    isValidSession: { type: Boolean, default: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  { timestamps: true },
);

const EmployeeSessionModel = model<EmployeeSessionDocument>(
  "EmployeeSession",
  employeeSessionSchema,
);
export default EmployeeSessionModel;
