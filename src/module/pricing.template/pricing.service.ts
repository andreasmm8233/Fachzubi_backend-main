import { pricingPlanModel } from "../../models/index";
import { type PricingPlan } from "../../models/pricingPlan";

// Drop empty feature lines sent by the admin form
const cleanPlan = (plan: PricingPlan): PricingPlan => ({
  ...plan,
  features: (plan.features ?? []).filter((feature) => feature.trim()),
});

export class PricingService {
  public async getPlansService() {
    return await pricingPlanModel.find().sort({ sortOrder: 1, createdAt: 1 });
  }

  public async addPlanService(plan: PricingPlan) {
    return await pricingPlanModel.create(cleanPlan(plan));
  }

  public async updatePlanService(id: string, plan: PricingPlan) {
    return await pricingPlanModel.findByIdAndUpdate(id, cleanPlan(plan), {
      new: true,
    });
  }

  public async deletePlanService(id: string) {
    return await pricingPlanModel.findByIdAndDelete(id);
  }
}
