"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employer_service_1 = require("./employer.service");
const fileHandler_1 = require("../../utils/fileHandler");
const logger_1 = __importDefault(require("../../utils/logger"));
const objectIdConvertor_1 = __importDefault(require("../../utils/objectIdConvertor"));
const companyImageHandler_1 = require("../../utils/companyImageHandler");
class EmployerController {
    employerService;
    fileHandler;
    objectIdConverter;
    companyImageHandler;
    constructor() {
        this.employerService = new employer_service_1.EmployerService();
        this.fileHandler = new fileHandler_1.FileHandler();
        this.objectIdConverter = new objectIdConvertor_1.default();
        this.companyImageHandler = new companyImageHandler_1.CompanyImageHandler();
    }
    getAllEmployers = async (req, res) => {
        try {
            const { searchValue, pageNo, filter, recordPerPage } = req.query;
            const employers = await this.employerService.getAllEmployersService(searchValue, pageNo, filter, recordPerPage);
            const totalRecords = await this.employerService.getCount();
            const recordPerPageValue = recordPerPage ? Number(recordPerPage) : 10;
            const count = Math.ceil(totalRecords / recordPerPageValue);
            res.sendSuccess200Response("Employers retrieved successfully", {
                employers,
                count,
            });
        }
        catch (error) {
            logger_1.default.error("getAllEmployers", error);
            res.sendErrorResponse("Error retrieving employers", error);
        }
    };
    getEmployerById = async (req, res) => {
        try {
            const { id } = req.params;
            const employer = await this.employerService.getEmployerByIdService(id);
            if (!employer) {
                res.sendNotFound404Response("Employer not found", null);
                return;
            }
            const newPayloadForFrontend = {
                data: employer.employerDetail,
                images: employer.images,
            };
            res.sendSuccess200Response("Employer retrieved successfully", newPayloadForFrontend);
        }
        catch (error) {
            res.sendErrorResponse("Error retrieving employer", error);
        }
    };
    updateEmployerById = async (req, res) => {
        try {
            const companyImages = req.files?.companyImages;
            const { id } = req.params;
            if (req.body.companyLogo) {
                req.body.companyLogo = this.objectIdConverter.convertToObjectId(req.body.companyLogo);
            }
            if (req?.files?.companyLogo) {
                const mediaId = await this.fileHandler.saveFileAndCreateMedia(req.files.companyLogo);
                req.body.companyLogo = mediaId ?? "";
            }
            const updatedEmployer = await this.employerService.updateEmployerByIdService(id, req.body);
            const { removedFile } = req.body;
            if (updatedEmployer) {
                await this.companyImageHandler.saveFileAndCreateMedia(companyImages, removedFile, updatedEmployer._id);
            }
            res.sendSuccess200Response("Employer updated successfully", updatedEmployer);
        }
        catch (error) {
            res.sendErrorResponse("Error updating employer", error);
        }
    };
    deleteEmployerById = async (req, res) => {
        try {
            const { id } = req.query;
            if (id) {
                const deletedEmployer = await this.employerService.deleteEmployerByIdService(id);
                res.sendSuccess200Response("Employer marked as deleted successfully", deletedEmployer);
            }
        }
        catch (error) {
            res.sendErrorResponse("Error deleting employer", error);
        }
    };
    addEmployer = async (req, res) => {
        try {
            const { _id } = req.user;
            const companyImages = req.files?.["companyImages[]"];
            const { industryName, contactPerson, jobTitle, companyName, email, website, phoneNo, address, zipCode, companyDescription, videoLink, city, status, } = req.body;
            let companyLogo = "";
            if (req?.files?.companyLogo) {
                const mediaId = await this.fileHandler.saveFileAndCreateMedia(req.files.companyLogo);
                companyLogo = mediaId ?? "";
            }
            const newPayloadCompanyLogo = {};
            if (companyLogo) {
                newPayloadCompanyLogo.companyLogo = companyLogo;
            }
            if (city.length) {
                newPayloadCompanyLogo.city = city;
            }
            const newEmployer = await this.employerService.addEmployerService({
                industryName,
                contactPerson,
                jobTitle,
                companyName,
                email,
                website,
                phoneNo,
                address,
                zipCode,
                companyDescription,
                videoLink: JSON.parse(videoLink),
                status,
                createdBy: _id,
                isDeleted: false,
                ...newPayloadCompanyLogo,
            });
            const { removedFile } = req.body;
            if (newEmployer) {
                await this.companyImageHandler.saveFileAndCreateMedia(companyImages, removedFile, newEmployer._id);
            }
            res.sendCreated201Response("Employer added successfully", newEmployer);
        }
        catch (error) {
            res.sendErrorResponse("Error adding employer", error);
        }
    };
    getEmployerByCityAndIndustriesId = async (req, res) => {
        const { city } = req.params;
        try {
            const data = await this.employerService.getCompanyByCity(city);
            res.sendSuccess200Response(" success", data);
        }
        catch (error) {
            res.sendErrorResponse("failed", error);
        }
    };
    getEmpSuggesstion = async (req, res) => {
        try {
            const { suggesstion } = req.query;
            const data = await this.employerService.getSuggesstionService(suggesstion);
            res.sendSuccess200Response(" success", data);
        }
        catch (error) {
            res.sendErrorResponse("failed", error);
        }
    };
    getAllEmployersForFrontend = async (req, res) => {
        try {
            const { searchValue, isFillter, slectedCity, skip, } = req.query;
            const data = await this.employerService.getAllEmployersForFrontendService({ searchValue, isFillter, slectedCity, skip });
            res.sendSuccess200Response(" success", data);
        }
        catch (error) {
            res.sendErrorResponse("failed", error);
        }
    };
    getJobsByCompanyId = async (req, res) => {
        try {
            const { companyId, skip } = (req.query);
            const data = await this.employerService.getJobsByCompanyIdService(companyId, skip ?? 0);
            res.sendSuccess200Response("success", data);
        }
        catch (error) {
            res.sendErrorResponse("failed", error);
        }
    };
    getCompanyDetail = async (req, res) => {
        try {
            const { companyId } = req.params;
            const data = await this.employerService.getCompanyDetailService(companyId);
            res.sendSuccess200Response(" success", data);
        }
        catch (error) {
            res.sendErrorResponse("failed", error);
        }
    };
    addAppointment = async (req, res) => {
        try {
            const appoinmentData = req.body;
            await this.employerService.addAppoinmentService(appoinmentData);
            res.sendSuccess200Response(" success", null);
        }
        catch (error) {
            res.sendErrorResponse("failed", error);
        }
    };
}
exports.default = EmployerController;
//# sourceMappingURL=employer.controller.js.map