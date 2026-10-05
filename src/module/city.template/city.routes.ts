import express from "express";
import CityController from "./city.controller";
import AuthMiddleware from "../../middleware/authenticator";
import { cityModel } from "../../models/index";

const cityRoute = express.Router();
const cityController = new CityController();
const authMiddleware = new AuthMiddleware();

// Employees may only access cities they created themselves
const ownCityByParam = authMiddleware.requireOwnership(cityModel, (req) => req.params.id);
const ownCityByBody = authMiddleware.requireOwnership(cityModel, (req) => req.body.id);

cityRoute.get("/", cityController.getAllCities);
cityRoute.get("/get-city-frontend", cityController.getAllCitiesInFrontend);
cityRoute.get(
  "/get_all_city",
  authMiddleware.requireUser,
  cityController.getAllCitiesByFilter,
);
cityRoute.get(
  "/deleted/all",
  authMiddleware.requireUser,
  cityController.getAllDeletedCities,
);
cityRoute.post(
  "/restore/:id",
  authMiddleware.requireUser,
  ownCityByParam,
  cityController.restoreCityById,
);
cityRoute.delete(
  "/hard-delete/:id",
  authMiddleware.requireUser,
  ownCityByParam,
  cityController.hardDeleteCityById,
);
cityRoute.get(
  "/:id/download-qr",
  authMiddleware.requireUser,
  ownCityByParam,
  cityController.downloadCityQrCode,
);
cityRoute.get(
  "/:id",
  authMiddleware.requireUser,
  ownCityByParam,
  cityController.getCityById,
);
cityRoute.post("/", authMiddleware.requireUser, cityController.addCity);
cityRoute.put(
  "/",
  authMiddleware.requireUser,
  ownCityByBody,
  cityController.updateCityById,
);
cityRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  ownCityByParam,
  cityController.deleteCityById,
);

export default cityRoute;
