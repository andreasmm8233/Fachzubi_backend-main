"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_types_service_1 = require("./job.types.service");
const logger_1 = __importDefault(require("../../utils/logger"));
class JobTypesController {
    jobTypesService;
    constructor() {
        this.jobTypesService = new job_types_service_1.JobTypesService();
    }
    getJobTypeByName = async (req, res) => {
        try {
            const { jobTypeName } = req.params;
            const jobType = await this.jobTypesService.findByName(jobTypeName);
            if (!jobType) {
                res.sendNotFound404Response("Job type not found", null);
                return;
            }
            res.sendSuccess200Response("Job type retrieved successfully", jobType);
        }
        catch (error) {
            logger_1.default.error("getJobTypeByName", error);
            res.sendErrorResponse("Error retrieving job type by name", error);
        }
    };
    getAllJobTypes = async (_, res) => {
        try {
            const jobTypes = await this.jobTypesService.getAllJobTypesService();
            res.sendSuccess200Response("Job types retrieved successfully", jobTypes);
        }
        catch (error) {
            logger_1.default.error("getAllJobTypes", error);
            res.sendErrorResponse("Error retrieving job types", error);
        }
    };
    getJobTypeById = async (req, res) => {
        try {
            const { id } = req.params;
            const jobType = await this.jobTypesService.getJobTypeByIdService(id);
            if (!jobType) {
                res.sendNotFound404Response("Job type not found", null);
                return;
            }
            res.sendSuccess200Response("Job type retrieved successfully", jobType);
        }
        catch (error) {
            res.sendErrorResponse("Error retrieving job type", error);
        }
    };
    addJobType = async (req, res) => {
        try {
            const { name: jobTypeName } = req.body;
            const newJobType = await this.jobTypesService.addJobTypeService({
                jobTypeName,
                isDeleted: false,
            });
            res.sendCreated201Response("Job type added successfully", newJobType);
        }
        catch (error) {
            logger_1.default.error("addJobType", error);
            res.sendErrorResponse("Error adding job type", error);
        }
    };
    updateJobTypeById = async (req, res) => {
        try {
            const { id } = req.body;
            const { name: updatedJobTypeData } = req.body;
            const updatedJobType = await this.jobTypesService.updateJobTypeByIdService(id, {
                jobTypeName: updatedJobTypeData,
            });
            res.sendSuccess200Response("Job type updated successfully", updatedJobType);
        }
        catch (error) {
            res.sendErrorResponse("Error updating job type", error);
        }
    };
    deleteJobTypeById = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedJobType = await this.jobTypesService.deleteJobTypeByIdService(id);
            res.sendSuccess200Response("Job type marked as deleted successfully", deletedJobType);
        }
        catch (error) {
            res.sendErrorResponse("Error deleting job type", error);
        }
    };
    getAllJobTypesByFilter = async (req, res) => {
        try {
            const { searchValue, pageNo, recordPerPage } = req.query;
            const data = await this.jobTypesService.getAllJobTypesByFilter(searchValue, pageNo, recordPerPage);
            res.sendSuccess200Response("Retrieve job types successfully", data);
        }
        catch (error) {
            logger_1.default.error("getAllJobTypesByFilter", error);
            res.sendErrorResponse("Error retrieving job types by filter", error);
        }
    };
}
exports.default = JobTypesController;
//# sourceMappingURL=job.types.controller.js.map