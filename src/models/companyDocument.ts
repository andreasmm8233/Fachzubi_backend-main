import mongoose from "mongoose";
import { Schema, model, type Document } from "mongoose";

// PDF / Word files attached to a company ("Dokumente" on the detail page).
export interface CompanyDocumentLink {
  companyId: mongoose.Schema.Types.ObjectId;
  documentId: mongoose.Schema.Types.ObjectId;
}

export interface CompanyDocumentLinkDocument
  extends CompanyDocumentLink,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

const companyDocument = new Schema<CompanyDocumentLinkDocument>(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Media",
    },
  },
  {
    timestamps: true,
  },
);

const _companyDocumentModel = model<CompanyDocumentLinkDocument>(
  "CompanyDocuments",
  companyDocument,
);

export default _companyDocumentModel;
