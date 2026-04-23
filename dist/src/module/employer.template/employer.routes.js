"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employer_controller_1 = __importDefault(require("./employer.controller"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const employerRoute = express_1.default.Router();
const employerController = new employer_controller_1.default();
const authMiddleware = new authenticator_1.default();
employerRoute.get("/", authMiddleware.requireUser, employerController.getAllEmployers);
employerRoute.post("/", authMiddleware.requireUser, employerController.addEmployer);
employerRoute.put("/:id", authMiddleware.requireUser, employerController.updateEmployerById);
employerRoute.delete("/", authMiddleware.requireUser, employerController.deleteEmployerById);
employerRoute.get("/get-employer-by-city-id/:city", authMiddleware.requireUser, employerController.getEmployerByCityAndIndustriesId);
employerRoute.get("/get-emp-suggesstion", employerController.getEmpSuggesstion);
employerRoute.get("/get-all-emp-frontend", employerController.getAllEmployersForFrontend);
employerRoute.get("/get-jobs-by-id", employerController.getJobsByCompanyId);
employerRoute.post("/add-appoinment", employerController.addAppointment);
employerRoute.get("/company-Detail/:companyId", employerController.getCompanyDetail);
employerRoute.get("/:id", authMiddleware.requireUser, employerController.getEmployerById);
exports.default = employerRoute;
//# sourceMappingURL=employer.routes.js.map