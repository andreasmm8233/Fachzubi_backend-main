"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_service_1 = require("./job.service");
const logger_1 = __importDefault(require("../../utils/logger"));
const fileHandler_1 = require("../../utils/fileHandler");
const job_documents_service_1 = require("./job.documents.service");
const jobsImageHandler_1 = require("../../utils/jobsImageHandler");
class JobController {
    jobService;
    fileHandler;
    jobDocumentService;
    jobImageHandler;
    constructor() {
        this.jobService = new job_service_1.JobService();
        this.fileHandler = new fileHandler_1.FileHandler();
        this.jobDocumentService = new job_documents_service_1.JobDocumentService();
        this.jobImageHandler = new jobsImageHandler_1.JobImageHandler();
    }
    getAllJobs = async (req, res) => {
        try {
            const { searchValue, pageNo, filter, recordPerPage, slectedCity, isFillter, isFrontend, } = req.query;
            const jobs = await this.jobService.getAllJobsService(searchValue, Number(pageNo), filter, Number(recordPerPage), slectedCity, isFillter, isFrontend);
            const totalRecords = await this.jobService.getCount();
            const recordPerPageValue = recordPerPage ? Number(recordPerPage) : 10;
            const count = Math.ceil(totalRecords / recordPerPageValue);
            res.sendSuccess200Response("Jobs retrieved successfully", {
                jobs,
                count,
            });
        }
        catch (error) {
            logger_1.default.error("getAllJobs", error);
            res.sendErrorResponse("Error retrieving jobs", error);
        }
    };
    getJobById = async (req, res) => {
        try {
            const { id } = req.params;
            const job = await this.jobService.getJobByIdService(id);
            if (!job) {
                res.sendNotFound404Response("Job not found", null);
                return;
            }
            res.sendSuccess200Response("Job retrieved successfully", job);
        }
        catch (error) {
            res.sendErrorResponse("Error retrieving job", error);
        }
    };
    updateJobById = async (req, res) => {
        try {
            const { id } = req.body;
            if (!req.body.startTime) {
                req.body.startTime = null;
            }
            if (req.body.videoLink && Array.isArray(req.body.videoLink)) {
            }
            else {
                if (!req.body.videoLink) {
                    req.body.videoLink = [];
                }
                else {
                    const newVideoLink = [];
                    newVideoLink.push(req.body.videoLink);
                    req.body.videoLink = newVideoLink;
                }
            }
            const files = Array.isArray(req.files?.attachments)
                ? req.files?.attachments
                : [req.files?.attachments];
            const attachments = [];
            for (const file of files) {
                const id = await this.fileHandler.saveFileAndCreateMedia(file);
                attachments.push(id);
            }
            if (req.body.newCity) {
                req.body.city = req.body.newCity;
            }
            const updatedJob = await this.jobService.updateJobByIdService(id, req.body);
            const { removedFile } = req.body;
            const jobsImages = req.files?.jobsImages;
            if (updatedJob) {
                await this.jobImageHandler.saveFileAndCreateMedia(jobsImages, removedFile, id);
            }
            if (req.files?.attachments) {
                await this.jobDocumentService.addDocuments(attachments, id);
            }
            if (req.body?.deletedAttachment) {
                const deletedAttachments = Array.isArray(req.body?.deletedAttachment)
                    ? req.body?.deletedAttachment
                    : [req.body?.deletedAttachment];
                await this.jobDocumentService.deleteDocuments(deletedAttachments);
            }
            res.sendSuccess200Response("Job updated successfully", updatedJob);
        }
        catch (error) {
            res.sendErrorResponse("Error updating job", error);
        }
    };
    deleteJobById = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedJob = await this.jobService.deleteJobByIdService(id);
            res.sendSuccess200Response("Job marked as deleted successfully", deletedJob);
        }
        catch (error) {
            res.sendErrorResponse("Error deleting job", error);
        }
    };
    addJob = async (req, res) => {
        try {
            const { _id } = req.user;
            const { company, jobTitle, email, additionalEmail, address, zipCode, jobDescription, status, isDeleted, industryName, newCity: city, jobType, } = req.body;
            if (!req.body.startTime) {
                req.body.startTime = null;
            }
            const { startDate } = req.body;
            if (req.body.videoLink && Array.isArray(req.body.videoLink)) {
            }
            else {
                if (!req.body.videoLink) {
                    req.body.videoLink = [];
                }
                else {
                    const newVideoLink = [];
                    newVideoLink.push(req.body.videoLink);
                    req.body.videoLink = newVideoLink;
                }
            }
            const { videoLink } = req.body;
            const files = Array.isArray(req.files?.attachments)
                ? req.files?.attachments
                : [req.files?.attachments];
            const attachments = [];
            for (const file of files) {
                if (file) {
                    const id = await this.fileHandler.saveFileAndCreateMedia(file);
                    attachments.push(id);
                }
            }
            const newJob = await this.jobService.addJobService({
                city,
                company,
                jobTitle,
                startDate,
                email,
                additionalEmail,
                address,
                zipCode,
                jobDescription,
                status,
                createdBy: _id,
                isDeleted,
                industryName,
                videoLink,
                jobType,
            });
            const { removedFile } = req.body;
            const jobsImages = req.files?.jobsImages;
            if (newJob) {
                await this.jobImageHandler.saveFileAndCreateMedia(jobsImages, removedFile, newJob._id);
            }
            await this.jobDocumentService.addDocuments(attachments, newJob._id);
            res.sendCreated201Response("Job added successfully", newJob);
        }
        catch (error) {
            res.sendErrorResponse("Error adding job", error);
        }
    };
    getJobSuggestion = async (req, res) => {
        try {
            const { suggestion } = req.query;
            const data = await this.jobService.getSuggestionService(suggestion);
            res.sendCreated201Response("Success", data);
        }
        catch (error) {
            res.sendErrorResponse("error", error);
        }
    };
    addApplication = async (req, res) => {
        try {
            void this.jobService.addApplicationService(req.body);
            res.sendSuccess200Response("submit successfully", null);
        }
        catch (error) {
            res.sendErrorResponse("error", error);
        }
    };
}
exports.default = JobController;
//# sourceMappingURL=job.controller.js.map