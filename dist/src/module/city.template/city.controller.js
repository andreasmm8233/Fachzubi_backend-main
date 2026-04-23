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
    getAllCities = async (_, res) => {
        try {
            const cities = await this.cityService.getAllCitiesService();
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
            const payload = { searchValue, pageNo, recordPerPage };
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
    addCity = async (req, res) => {
        try {
            const newCity = await this.cityService.addCityService(req.body);
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
            res.sendSuccess200Response("City deleted successfully", deletedCity);
        }
        catch (error) {
            res.sendErrorResponse("Error deleting city", error);
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