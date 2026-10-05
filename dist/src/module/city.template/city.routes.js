"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const city_controller_1 = __importDefault(require("./city.controller"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const index_1 = require("../../models/index");
const cityRoute = express_1.default.Router();
const cityController = new city_controller_1.default();
const authMiddleware = new authenticator_1.default();
const ownCityByParam = authMiddleware.requireOwnership(index_1.cityModel, (req) => req.params.id);
const ownCityByBody = authMiddleware.requireOwnership(index_1.cityModel, (req) => req.body.id);
cityRoute.get("/", cityController.getAllCities);
cityRoute.get("/get-city-frontend", cityController.getAllCitiesInFrontend);
cityRoute.get("/get_all_city", authMiddleware.requireUser, cityController.getAllCitiesByFilter);
cityRoute.get("/deleted/all", authMiddleware.requireUser, cityController.getAllDeletedCities);
cityRoute.post("/restore/:id", authMiddleware.requireUser, ownCityByParam, cityController.restoreCityById);
cityRoute.delete("/hard-delete/:id", authMiddleware.requireUser, ownCityByParam, cityController.hardDeleteCityById);
cityRoute.get("/:id/download-qr", authMiddleware.requireUser, ownCityByParam, cityController.downloadCityQrCode);
cityRoute.get("/:id", authMiddleware.requireUser, ownCityByParam, cityController.getCityById);
cityRoute.post("/", authMiddleware.requireUser, cityController.addCity);
cityRoute.put("/", authMiddleware.requireUser, ownCityByBody, cityController.updateCityById);
cityRoute.delete("/:id", authMiddleware.requireUser, ownCityByParam, cityController.deleteCityById);
exports.default = cityRoute;
//# sourceMappingURL=city.routes.js.map