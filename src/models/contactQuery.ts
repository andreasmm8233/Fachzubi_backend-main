import { Schema, model, type Document } from "mongoose";

// A message sent through the contact form on the website (/kontakt).
export interface ContactQuery {
  companyName: string;
  email: string;
  phoneNo: string;
  description?: string;
}

export interface ContactQueryDocument extends ContactQuery, Document {
  createdAt: Date;
  updatedAt: Date;
}

const contactQuerySchema = new Schema<ContactQueryDocument>(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const _ContactQueryModel = model<ContactQueryDocument>(
  "ContactQuery",
  contactQuerySchema,
);

export default _ContactQueryModel;
