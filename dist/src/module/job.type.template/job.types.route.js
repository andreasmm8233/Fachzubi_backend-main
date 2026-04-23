"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const job_types_controller_1 = __importDefault(require("./job.types.controller"));
const jobTypesRoute = express_1.default.Router();
const jobTypesController = new job_types_controller_1.default();
const authMiddleware = new authenticator_1.default();
jobTypesRoute.get("/", authMiddleware.requireUser, jobTypesController.getAllJobTypes);
jobTypesRoute.get("/get_all_JobType", jobTypesController.getAllJobTypesByFilter);
jobTypesRoute.get("/:id", authMiddleware.requireUser, jobTypesController.getJobTypeById);
jobTypesRoute.post("/", authMiddleware.requireUser, jobTypesController.addJobType);
jobTypesRoute.put("/", authMiddleware.requireUser, jobTypesController.updateJobTypeById);
jobTypesRoute.delete("/:id", authMiddleware.requireUser, jobTypesController.deleteJobTypeById);
jobTypesRoute.get("/find/:jobTypeName", authMiddleware.requireUser, jobTypesController.getJobTypeByName);
exports.default = jobTypesRoute;
//# sourceMappingURL=job.types.route.js.map