import express from "express";
import EmployerController from "./employer.controller";
import AuthMiddleware from "../../middleware/authenticator";
import { employerModel } from "../../models/index";

const employerRoute = express.Router();
const employerController = new EmployerController();
const authMiddleware = new AuthMiddleware();

// Employees may only access companies they created themselves
const ownEmployerByParam = authMiddleware.requireOwnership(
  employerModel,
  (req) => req.params.id,
);
const ownEmployerByQuery = authMiddleware.requireOwnership(
  employerModel,
  (req) => req.query.id,
);

employerRoute.get(
  "/",
  authMiddleware.requireUser,
  employerController.getAllEmployers,
);

employerRoute.post(
  "/",
  authMiddleware.requireUser,
  // joiValidator.validate(createEmployerBodyValidator, "body"),
  employerController.addEmployer,
);
employerRoute.put(
  "/:id",
  authMiddleware.requireUser,
  // joiValidator.validate(updateEmployerSchema, "body"),
  ownEmployerByParam,
  employerController.updateEmployerById,
);
employerRoute.delete(
  "/",
  authMiddleware.requireUser,
  ownEmployerByQuery,
  employerController.deleteEmployerById,
);
employerRoute.get(
  "/get-employer-by-city-id/:city",
  authMiddleware.requireUser,
  employerController.getEmployerByCityAndIndustriesId,
);
employerRoute.get("/get-emp-suggesstion", employerController.getEmpSuggesstion);
employerRoute.get(
  "/get-all-emp-frontend",
  employerController.getAllEmployersForFrontend,
);
employerRoute.get("/get-jobs-by-id", employerController.getJobsByCompanyId);
employerRoute.post("/add-appoinment", employerController.addAppointment);

employerRoute.get(
  "/company-Detail/:companyId",
  employerController.getCompanyDetail,
);
employerRoute.get(
  "/deleted/all",
  authMiddleware.requireUser,
  employerController.getAllDeletedEmployers,
);
employerRoute.post(
  "/restore/:id",
  authMiddleware.requireUser,
  ownEmployerByParam,
  employerController.restoreEmployerById,
);
employerRoute.delete(
  "/hard-delete/:id",
  authMiddleware.requireUser,
  ownEmployerByParam,
  employerController.hardDeleteEmployerById,
);

employerRoute.get(
  "/:id",
  authMiddleware.requireUser,
  ownEmployerByParam,
  employerController.getEmployerById,
);

export default employerRoute;
