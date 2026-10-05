import express from "express";
import JobController from "./job.controller";
import AuthMiddleware from "../../middleware/authenticator";
import { createJobSchema, updateJobSchema } from "./job.types";
import JoiValidator from "../../utils/joiValidator";
import { jobModel } from "../../models/index";

const jobRoute = express.Router();
const jobController = new JobController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();

// Employees may only access jobs they created themselves
const ownJobByParam = authMiddleware.requireOwnership(jobModel, (req) => req.params.id);
const ownJobByBody = authMiddleware.requireOwnership(
  jobModel,
  (req) => req.body.id ?? req.params.id,
);

jobRoute.get("/get-suggestion", jobController.getJobSuggestion);
jobRoute.post("/job-application", jobController.addApplication);
jobRoute.get("/", jobController.getAllJobs);
jobRoute.get("/deleted/all", authMiddleware.requireUser, jobController.getAllDeletedJobs);
jobRoute.post(
  "/restore/:id",
  authMiddleware.requireUser,
  ownJobByParam,
  jobController.restoreJobById,
);
jobRoute.delete(
  "/hard-delete/:id",
  authMiddleware.requireUser,
  ownJobByParam,
  jobController.hardDeleteJobById,
);
jobRoute.get("/:id", ownJobByParam, jobController.getJobById);
jobRoute.post(
  "/",
  authMiddleware.requireUser,
  joiValidator.validate(createJobSchema, "body"),
  jobController.addJob,
);
jobRoute.put(
  "/:id",
  authMiddleware.requireUser,
  joiValidator.validate(updateJobSchema, "body"),
  ownJobByBody,
  jobController.updateJobById,
);
jobRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  ownJobByParam,
  jobController.deleteJobById,
);

export default jobRoute;
