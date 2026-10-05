"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const city_service_1 = require("./city.service");
const logger_1 = __importDefault(require("../../utils/logger"));
class CityController {
    cityService;
    constructor() {
        this.cityService = new city_service_1.CityService();
    }
    getAllCities = async (req, res) => {
        try {
            const creatorFilter = req.employee
                ? { createdBy: req.employee._id, createdByModel: "Employee" }
                : undefined;
            const cities = await this.cityService.getAllCitiesService(creatorFilter);
            res.sendSuccess200Response("Cities retrieved successfully", cities);
        }
        catch (error) {
            logger_1.default.error("getAllCities", error);
            res.sendErrorResponse("Error retrieving cities", error);
        }
    };
    getAllCitiesByFilter = async (req, res) => {
        try {
            const { searchValue, pageNo, recordPerPage } = req.query;
            const creatorFilter = req.employee
                ? { createdBy: req.employee._id, createdByModel: "Employee" }
                : undefined;
            const payload = { searchValue, pageNo, recordPerPage, creatorFilter };
            const cities = await this.cityService.getAllCitiesByFilter(payload);
            res.sendSuccess200Response("Cities retrieved successfully", cities);
        }
        catch (error) {
            logger_1.default.error("getAllCities", error);
            res.sendErrorResponse("Error retrieving cities", error);
        }
    };
    getCityById = async (req, res) => {
        try {
            const { id } = req.params;
            const city = await this.cityService.getCityByIdService(id);
            if (!city) {
                res.sendNotFound404Response("City not found", null);
                return;
            }
            res.sendSuccess200Response("City retrieved successfully", city);
        }
        catch (error) {
            res.sendErrorResponse("Error retrieving city", error);
        }
    };
    downloadCityQrCode = async (req, res) => {
        try {
            const { id } = req.params;
            const city = await this.cityService.getCityByIdService(id);
            if (!city) {
                res.sendNotFound404Response("City not found", null);
                return;
            }
            if (!city.qrCode) {
                res.sendNotFound404Response("QR code not found for this city", null);
                return;
            }
            const qrResponse = await fetch(city.qrCode);
            if (!qrResponse.ok) {
                res.sendErrorResponse("Failed to fetch QR code image", null);
                return;
            }
            const imageArrayBuffer = await qrResponse.arrayBuffer();
            const imageBuffer = Buffer.from(imageArrayBuffer);
            const citySlug = city.name
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            res.setHeader("Content-Type", "image/png");
            res.setHeader("Content-Disposition", `attachment; filename=\"city-${citySlug || id}-qr.png\"`);
            res.send(imageBuffer);
        }
        catch (error) {
            logger_1.default.error("downloadCityQrCode", error);
            res.sendErrorResponse("Error downloading city QR code", error);
        }
    };
    addCity = async (req, res) => {
        try {
            const creator = req.user || req.employee;
            logger_1.default.info("[CityController.addCity] req.body: " + JSON.stringify(req.body));
            const newCity = await this.cityService.addCityService({
                ...req.body,
                createdBy: creator?._id,
                createdByModel: req.user ? "User" : "Employee",
            });
            res.sendCreated201Response("City added successfully", newCity);
        }
        catch (error) {
            logger_1.default.error("addCity", error);
            res.sendErrorResponse("Error adding city", error);
        }
    };
    updateCityById = async (req, res) => {
        try {
            const { id } = req.body;
            const updatedCity = await this.cityService.updateCityByIdService(id, req.body);
            res.sendSuccess200Response("City updated successfully", updatedCity);
        }
        catch (error) {
            res.sendErrorResponse("Error updating city", error);
        }
    };
    deleteCityById = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedCity = await this.cityService.deleteCityByIdService(id);
            res.sendSuccess200Response("City moved to trash successfully", deletedCity);
        }
        catch (error) {
            res.sendErrorResponse("Error deleting city", error);
        }
    };
    getAllDeletedCities = async (req, res) => {
        try {
            const { searchValue, pageNo, recordPerPage } = req.query;
            const creatorFilter = req.employee
                ? { createdBy: req.employee._id, createdByModel: "Employee" }
                : undefined;
            const result = await this.cityService.getAllDeletedCitiesService({
                searchValue: searchValue,
                pageNo: pageNo,
                recordPerPage: recordPerPage,
                creatorFilter,
            });
            res.sendSuccess200Response("Deleted cities retrieved successfully", result);
        }
        catch (error) {
            logger_1.default.error("getAllDeletedCities", error);
            res.sendErrorResponse("Error retrieving deleted cities", error);
        }
    };
    restoreCityById = async (req, res) => {
        try {
            const { id } = req.params;
            const restoredCity = await this.cityService.restoreCityByIdService(id);
            res.sendSuccess200Response("City restored successfully", restoredCity);
        }
        catch (error) {
            logger_1.default.error("restoreCityById", error);
            res.sendErrorResponse("Error restoring city", error);
        }
    };
    hardDeleteCityById = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedCity = await this.cityService.hardDeleteCityByIdService(id);
            res.sendSuccess200Response("City deleted permanently", deletedCity);
        }
        catch (error) {
            logger_1.default.error("hardDeleteCityById", error);
            res.sendErrorResponse("Error deleting city permanently", error);
        }
    };
    getAllCitiesInFrontend = async (_, res) => {
        try {
            const cities = await this.cityService.getAllCitiesFrontendService();
            res.sendSuccess200Response("Cities retrieved successfully", cities);
        }
        catch (error) {
            logger_1.default.error("getAllCities", error);
            res.sendErrorResponse("Error retrieving cities", error);
        }
    };
}
exports.default = CityController;
//# sourceMappingURL=city.controller.js.map