"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_controller_1 = __importDefault(require("./job.controller"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const job_types_1 = require("./job.types");
const joiValidator_1 = __importDefault(require("../../utils/joiValidator"));
const jobRoute = express_1.default.Router();
const jobController = new job_controller_1.default();
const authMiddleware = new authenticator_1.default();
const joiValidator = new joiValidator_1.default();
jobRoute.get("/get-suggestion", jobController.getJobSuggestion);
jobRoute.post("/job-application", jobController.addApplication);
jobRoute.get("/", jobController.getAllJobs);
jobRoute.get("/:id", jobController.getJobById);
jobRoute.post("/", authMiddleware.requireUser, joiValidator.validate(job_types_1.createJobSchema, "body"), jobController.addJob);
jobRoute.put("/:id", authMiddleware.requireUser, joiValidator.validate(job_types_1.updateJobSchema, "body"), jobController.updateJobById);
jobRoute.delete("/:id", authMiddleware.requireUser, jobController.deleteJobById);
exports.default = jobRoute;
//# sourceMappingURL=job.routes.js.map