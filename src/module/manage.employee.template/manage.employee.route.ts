import express from "express";
import EmployeeController from "./manage.employee.controller";
import AuthMiddleware from "../../middleware/authenticator";
import JoiValidator from "../../utils/joiValidator";
import {
  createEmployeeValidator,
  loginEmployeeValidator,
  updateEmployeeValidator,
} from "./manage.employee.schema";

const employeeRoute = express.Router();
const employeeController = new EmployeeController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();

// Public
employeeRoute.post(
  "/login",
  joiValidator.validate(loginEmployeeValidator, "body"),
  employeeController.loginEmployee,
);

// Admin-only
employeeRoute.get("/", authMiddleware.requireAdmin, employeeController.getAllEmployees);
employeeRoute.get("/:id", authMiddleware.requireAdmin, employeeController.getEmployeeById);
employeeRoute.get(
  "/:id/employers",
  authMiddleware.requireAdmin,
  employeeController.getEmployersByEmployee,
);
employeeRoute.get(
  "/:id/jobs",
  authMiddleware.requireAdmin,
  employeeController.getJobsByEmployee,
);
employeeRoute.post(
  "/",
  authMiddleware.requireAdmin,
  joiValidator.validate(createEmployeeValidator, "body"),
  employeeController.createEmployee,
);
employeeRoute.put(
  "/",
  authMiddleware.requireAdmin,
  joiValidator.validate(updateEmployeeValidator, "body"),
  employeeController.updateEmployee,
);
employeeRoute.delete("/:id", authMiddleware.requireAdmin, employeeController.deleteEmployee);

export default employeeRoute;
