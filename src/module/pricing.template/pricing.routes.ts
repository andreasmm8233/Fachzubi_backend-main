import express from "express";
import PricingController from "./pricing.controller";
import AuthMiddleware from "../../middleware/authenticator";
import JoiValidator from "../../utils/joiValidator";
import { pricingPlanValidator } from "./pricing.schema";

const pricingRoute = express.Router();
const pricingController = new PricingController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();

pricingRoute.get("/", pricingController.getPlans);
pricingRoute.post(
  "/",
  authMiddleware.requireUser,
  joiValidator.validate(pricingPlanValidator, "body"),
  pricingController.addPlan,
);
pricingRoute.put(
  "/:id",
  authMiddleware.requireUser,
  joiValidator.validate(pricingPlanValidator, "body"),
  pricingController.updatePlan,
);
pricingRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  pricingController.deletePlan,
);

export default pricingRoute;
