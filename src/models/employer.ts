import mongoose, { Schema, model, type Document } from "mongoose";

export interface Employer {
  industryName?: Schema.Types.ObjectId;
  contactPerson?: string;
  jobTitle?: string;
  companyName?: string;
  email?: string;
  website?: string;
  phoneNo?: string;
  address?: string;
  zipCode?: string;
  companyLogo?: mongoose.Schema.Types.ObjectId;
  companyDescription?: string;
  videoLink?: string[];
  city?: mongoose.Schema.Types.ObjectId;
  status?: boolean;
  isDeleted?: boolean;
  createdBy?: Schema.Types.ObjectId;
  createdByModel?: "User" | "Employee";
}

export interface EmployerDocument extends Employer, Document {
  createdAt: Date;
  updatedAt: Date;
  companyImage?: any;
}

const employerSchema = new Schema<EmployerDocument>(
  {
    industryName: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Industries",
    },
    contactPerson: { type: String, required: false },
    jobTitle: { type: String, required: false },
    companyName: { type: String, required: false },
    email: { type: String, required: false },
    website: { type: String, required: false },
    phoneNo: { type: String, required: false },
    address: { type: String, required: false },
    zipCode: { type: String, required: false },
    companyLogo: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Media",
    },
    companyDescription: { type: String, required: false },
    videoLink: { type: [{ type: String }], required: false },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "City",
    },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: true },
    createdByModel: {
      type: String,
      enum: ["User", "Employee"],
      default: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel",
    },
  },
  {
    timestamps: true,
  },
);

const _EmployerModel = model<EmployerDocument>("Employer", employerSchema);

export default _EmployerModel;
