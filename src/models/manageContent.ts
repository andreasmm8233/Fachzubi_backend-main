import { Schema, model, type Document } from "mongoose";

export interface ManageContent {
  privacyPolicy: string;
  termsConditions: string;
  jobCoverLetter: string;
  appointment: string;
  heading: string;
  subHeading: string;
  bottomBarText: string;
  // Homepage city search card
  searchTitle?: string;
  searchSubtitle?: string;
  // Banners of the public companies/jobs pages
  companiesHeading?: string;
  companiesSubHeading?: string;
  jobsHeading?: string;
  jobsSubHeading?: string;
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
    searchTitle: { type: String, required: false },
    searchSubtitle: { type: String, required: false },
    companiesHeading: { type: String, required: false },
    companiesSubHeading: { type: String, required: false },
    jobsHeading: { type: String, required: false },
    jobsSubHeading: { type: String, required: false },
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
