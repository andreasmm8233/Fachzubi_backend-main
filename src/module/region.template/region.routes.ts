import express from "express";
import RegionController from "./region.controller";
import AuthMiddleware from "../../middleware/authenticator";

const regionRoute = express.Router();
const regionController = new RegionController();
const authMiddleware = new AuthMiddleware();

regionRoute.get(
  "/",
  authMiddleware.requireUser,
  regionController.getAllRegions,
);
regionRoute.get("/get_all_Region", regionController.getAllRegion);
regionRoute.get(
  "/:id",
  authMiddleware.requireUser,
  regionController.getRegionById,
);
regionRoute.post(
  "/",
  authMiddleware.requireUser,
  regionController.addRegion,
);
regionRoute.put(
  "/",
  authMiddleware.requireUser,
  regionController.updateRegionById,
);
regionRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  regionController.deleteRegionById,
);

export default regionRoute;
