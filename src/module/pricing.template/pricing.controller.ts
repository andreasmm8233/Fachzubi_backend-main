import { type Request, type Response } from "express";
import { PricingService } from "./pricing.service";
import logger from "../../utils/logger";

const pickPlan = (body: any) => {
  const {
    name,
    description,
    price,
    duration,
    features,
    sortOrder,
    highlighted,
    priceNote,
    buttonText,
    badgeText,
  } = body;
  return {
    name,
    description,
    price,
    duration,
    features,
    sortOrder,
    highlighted: Boolean(highlighted),
    priceNote,
    buttonText,
    badgeText,
  };
};

class PricingController {
  private readonly pricingService: PricingService;

  constructor() {
    this.pricingService = new PricingService();
  }

  // Public: plans for the pricing page
  public getPlans = async (_: Request, res: Response) => {
    try {
      const plans = await this.pricingService.getPlansService();
      res.sendSuccess200Response("Plans retrieved successfully", plans);
    } catch (error) {
      logger.error("getPlans", error);
      res.sendErrorResponse("Error retrieving plans", error);
    }
  };

  public addPlan = async (req: Request, res: Response) => {
    try {
      const plan = await this.pricingService.addPlanService(pickPlan(req.body));
      res.sendCreated201Response("Plan added successfully", plan);
    } catch (error) {
      logger.error("addPlan", error);
      res.sendErrorResponse("Error adding plan", error);
    }
  };

  public updatePlan = async (req: Request, res: Response) => {
    try {
      const plan = await this.pricingService.updatePlanService(
        req.params.id,
        pickPlan(req.body),
      );
      if (!plan) {
        res.sendNotFound404Response("Plan not found", null);
        return;
      }
      res.sendSuccess200Response("Plan updated successfully", plan);
    } catch (error) {
      logger.error("updatePlan", error);
      res.sendErrorResponse("Error updating plan", error);
    }
  };

  public deletePlan = async (req: Request, res: Response) => {
    try {
      const plan = await this.pricingService.deletePlanService(req.params.id);
      if (!plan) {
        res.sendNotFound404Response("Plan not found", null);
        return;
      }
      res.sendSuccess200Response("Plan deleted successfully", plan);
    } catch (error) {
      logger.error("deletePlan", error);
      res.sendErrorResponse("Error deleting plan", error);
    }
  };
}

export default PricingController;
