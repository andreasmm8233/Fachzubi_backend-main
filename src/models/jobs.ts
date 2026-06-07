import { Schema, model, type Document } from "mongoose";

export interface Job {
  city: Schema.Types.ObjectId;
  company: Schema.Types.ObjectId;
  jobTitle: string;
  startDate: Date;
  email: string;
  additionalEmail?: string;
  address: string;
  zipCode: string;
  jobDescription: string;
  status: boolean;
  createdBy: Schema.Types.ObjectId;
  createdByModel?: "User" | "Employee";
  isDeleted: boolean;
  industryName: Schema.Types.ObjectId;
  videoLink: string[];
  jobType: Schema.Types.ObjectId;
  region?: Schema.Types.ObjectId;
}

export interface JobDocument extends Job, Document {
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<JobDocument>(
  {
    jobType: { type: Schema.Types.ObjectId, required: false },
    videoLink: { type: [{ type: String }], required: false },
    city: [{ type: Schema.Types.ObjectId, ref: "City", required: true }],
    industryName: {
      type: Schema.Types.ObjectId,
      ref: "Industries",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    jobTitle: { type: String, required: true },
    startDate: { type: Date, required: false },
    email: { type: String, required: true },
    additionalEmail: { type: String },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    jobDescription: { type: String, required: true },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
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
    region: {
      type: Schema.Types.ObjectId,
      ref: "Region",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const _JobModel = model<JobDocument>("Job", jobSchema);

export default _JobModel;
