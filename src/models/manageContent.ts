import { Schema, model, type Document } from "mongoose";

export interface ManageContent {
  privacyPolicy: string;
  termsConditions: string;
  jobCoverLetter: string;
  appointment: string;
  heading: string;
  subHeading: string;
  bottomBarText: string;
}

export interface ManageContentDocument extends ManageContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const manageContentSchema = new Schema<ManageContentDocument>(
  {
    privacyPolicy: { type: String, required: true },
    termsConditions: { type: String, required: true },
    jobCoverLetter: { type: String, required: true },
    appointment: { type: String, required: true },
    heading: { type: String, required: true },
    subHeading: { type: String, required: true },
    bottomBarText: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const _ManageContentModel = model<ManageContentDocument>(
  "ManageContent",
  manageContentSchema,
);

export default _ManageContentModel;
