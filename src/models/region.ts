import { Schema, model, type Document } from "mongoose";

export interface Region {
  regionName: string;
  isDeleted?: boolean;
}

export interface RegionDocument extends Region, Document {
  createdAt: Date;
  updatedAt: Date;
}

const regionSchema = new Schema<RegionDocument>(
  {
    regionName: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const RegionModel = model<RegionDocument>("Region", regionSchema);

export default RegionModel;
