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
const syncToAzubi_1 = require("../../utils/syncToAzubi");
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
            const employers = await this.employerService.getAllEmployersService(searchValue, pageNo, filter, recordPerPage, undefined);
            const totalRecords = await this.employerService.getCount();
            const recordPerPageValue = recordPerPage ? Number(recordPerPage) : 10;
            const count = Math.ceil(totalRecords / recordPerPageValue);
            res.sendSuccess200Response("Employers retrieved successfully", {
                employers,
                count,
                total: totalRecords,
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
                const raw = req.body.companyLogo;
                let logoId;
                if (typeof raw === "object" && raw !== null) {
                    logoId = raw._id ? String(raw._id) : undefined;
                }
                else if (typeof raw === "string" && raw.startsWith("{")) {
                    try {
                        const parsed = JSON.parse(raw);
                        logoId = parsed?._id ? String(parsed._id) : undefined;
                    }
                    catch {
                        logoId = raw;
                    }
                }
                else {
                    logoId = raw;
                }
                if (logoId && /^[a-fA-F0-9]{24}$/.test(logoId)) {
                    req.body.companyLogo = this.objectIdConverter.convertToObjectId(logoId);
                }
                else {
                    delete req.body.companyLogo;
                }
            }
            if (req?.files?.companyLogo) {
                const mediaId = await this.fileHandler.saveFileAndCreateMedia(req.files.companyLogo);
                req.body.companyLogo = mediaId ?? "";
            }
            delete req.body.region;
            const updatedEmployer = await this.employerService.updateEmployerByIdService(id, req.body);
            const { removedFile } = req.body;
            if (updatedEmployer) {
                await this.companyImageHandler.saveFileAndCreateMedia(companyImages, removedFile, updatedEmployer._id);
            }
            (0, syncToAzubi_1.syncCompanyToAzubi)(updatedEmployer);
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
            const creator = req.user || req.employee;
            const _id = creator?._id;
            const createdByModel = req.user ? "User" : "Employee";
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
                createdByModel,
                isDeleted: false,
                ...newPayloadCompanyLogo,
            });
            const { removedFile } = req.body;
            if (newEmployer) {
                await this.companyImageHandler.saveFileAndCreateMedia(companyImages, removedFile, newEmployer._id);
            }
            (0, syncToAzubi_1.syncCompanyToAzubi)(newEmployer);
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
            const { searchValue, isFillter, letter, slectedCity, skip, pageNo, recordPerPage, } = req.query;
            const data = await this.employerService.getAllEmployersForFrontendService({
                searchValue,
                isFillter,
                letter,
                slectedCity,
                skip,
                pageNo,
                recordPerPage,
            });
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
    getAllDeletedEmployers = async (req, res) => {
        try {
            const { searchValue, pageNo, recordPerPage } = req.query;
            const employers = await this.employerService.getAllDeletedEmployersService(searchValue, Number(pageNo), Number(recordPerPage));
            const totalRecords = await this.employerService.getDeletedCount();
            const recordPerPageValue = recordPerPage ? Number(recordPerPage) : 10;
            const count = Math.ceil(totalRecords / recordPerPageValue);
            res.sendSuccess200Response("Deleted employers retrieved successfully", {
                employers: employers.data,
                count,
            });
        }
        catch (error) {
            logger_1.default.error("getAllDeletedEmployers", error);
            res.sendErrorResponse("Error retrieving deleted employers", error);
        }
    };
    restoreEmployerById = async (req, res) => {
        try {
            const { id } = req.params;
            const restoredEmployer = await this.employerService.restoreEmployerByIdService(id);
            res.sendSuccess200Response("Employer restored successfully", restoredEmployer);
        }
        catch (error) {
            logger_1.default.error("restoreEmployerById", error);
            res.sendErrorResponse("Error restoring employer", error);
        }
    };
    hardDeleteEmployerById = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedEmployer = await this.employerService.hardDeleteEmployerByIdService(id);
            res.sendSuccess200Response("Employer deleted permanently", deletedEmployer);
        }
        catch (error) {
            logger_1.default.error("hardDeleteEmployerById", error);
            res.sendErrorResponse("Error deleting employer permanently", error);
        }
    };
}
exports.default = EmployerController;
//# sourceMappingURL=employer.controller.js.map