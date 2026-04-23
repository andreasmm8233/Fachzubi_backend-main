import { Schema, model, type Document } from "mongoose";

export interface City {
  name: string;
  isDeleted: boolean;
  startTime: Date; // Make startTime required
  endTime: Date; // Make endTime required
  address: string; // Make address required
  zipCode: string; // Make zipCode required
  directionLink: string; // Make directionLink required
  status: boolean;
}

export interface CityDocument extends City, Document {
  createdAt: Date;
  updatedAt: Date;
}

const citySchema = new Schema<CityDocument>(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    startTime: { type: Date }, // Make startTime required
    endTime: { type: Date }, // Make endTime required
    address: { type: String }, // Make address required
    zipCode: { type: String }, // Make zipCode required
    directionLink: { type: String }, // Make directionLink required
    status: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  },
);

const CityModel = model<CityDocument>("City", citySchema);

export default CityModel;
