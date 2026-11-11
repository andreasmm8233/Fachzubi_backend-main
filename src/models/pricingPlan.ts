import { Schema, model, type Document } from "mongoose";

// A plan on the pricing page of the website (/preise).
export interface PricingPlan {
  name: string;
  description?: string;
  price: number;
  duration: "month" | "year";
  features: string[];
  sortOrder: number;
  // Shown with a "Beliebt" badge on the website
  highlighted: boolean;
}

export interface PricingPlanDocument extends PricingPlan, Document {
  createdAt: Date;
  updatedAt: Date;
}

const pricingPlanSchema = new Schema<PricingPlanDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    duration: { type: String, enum: ["month", "year"], default: "month" },
    features: { type: [{ type: String }], default: [] },
    sortOrder: { type: Number, default: 0 },
    highlighted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const _PricingPlanModel = model<PricingPlanDocument>(
  "PricingPlan",
  pricingPlanSchema,
);

export default _PricingPlanModel;
