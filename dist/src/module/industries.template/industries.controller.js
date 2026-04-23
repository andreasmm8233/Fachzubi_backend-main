"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const industries_service_1 = require("./industries.service");
const logger_1 = __importDefault(require("../../utils/logger"));
class IndustriesController {
    industriesService;
    constructor() {
        this.industriesService = new industries_service_1.IndustriesService();
    }
    getAllIndustries = async (_, res) => {
        try {
            const industries = await this.industriesService.getAllIndustriesService();
            res.sendSuccess200Response("Industries retrieved successfully", industries);
        }
        catch (error) {
            logger_1.default.error("getAllIndustries", error);
            res.sendErrorResponse("Error retrieving industries", error);
        }
    };
    getIndustryById = async (req, res) => {
        try {
            const { id } = req.params;
            const industry = await this.industriesService.getIndustryByIdService(id);
            if (!industry) {
                res.sendNotFound404Response("Industry not found", null);
                return;
            }
            res.sendSuccess200Response("Industry retrieved successfully", industry);
        }
        catch (error) {
            res.sendErrorResponse("Error retrieving industry", error);
        }
    };
    addIndustry = async (req, res) => {
        try {
            const { name: industryName } = req.body;
            const newIndustry = await this.industriesService.addIndustryService(industryName);
            res.sendCreated201Response("Industry added successfully", newIndustry);
        }
        catch (error) {
            logger_1.default.error("addIndustry", error);
            res.sendErrorResponse("Error adding industry", error);
        }
    };
    updateIndustryById = async (req, res) => {
        try {
            const { id } = req.body;
            const { name: updatedIndustryData } = req.body;
            const updatedIndustry = await this.industriesService.updateIndustryByIdService(id, updatedIndustryData);
            res.sendSuccess200Response("Industry updated successfully", updatedIndustry);
        }
        catch (error) {
            res.sendErrorResponse("Error updating industry", error);
        }
    };
    deleteIndustryById = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedIndustry = await this.industriesService.deleteIndustryByIdService(id);
            res.sendSuccess200Response("Industry marked as deleted successfully", deletedIndustry);
        }
        catch (error) {
            res.sendErrorResponse("Error deleting industry", error);
        }
    };
    getAllIndustry = async (req, res) => {
        try {
            const { searchValue, pageNo, recordPerPage } = req.query;
            const data = await this.industriesService.getAllIndustriesByFilter(searchValue, pageNo, recordPerPage);
            res.sendSuccess200Response(" retrieve Industry  successfully", data);
        }
        catch (error) {
            logger_1.default.error("getAllIndustry", error);
            res.sendErrorResponse("Error getAllIndustry industry", error);
        }
    };
}
exports.default = IndustriesController;
//# sourceMappingURL=industries.controller.js.map