import { type Request, type Response } from "express";
import { EmployeeService } from "./manage.employee.service";
import logger from "../../utils/logger";

class EmployeeController {
  private readonly employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  public getAllEmployees = async (_: Request, res: Response) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      res.sendSuccess200Response("Employees retrieved successfully", employees);
    } catch (error) {
      logger.error("getAllEmployees", error);
      res.sendErrorResponse("Error retrieving employees", error);
    }
  };

  public getEmployeeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.getEmployeeById(id);
      if (!employee) {
        res.sendNotFound404Response("Employee not found", null);
        return;
      }
      res.sendSuccess200Response("Employee retrieved successfully", employee);
    } catch (error) {
      logger.error("getEmployeeById", error);
      res.sendErrorResponse("Error retrieving employee", error);
    }
  };

  public createEmployee = async (req: Request, res: Response) => {
    try {
      const employee = await this.employeeService.createEmployee(req.body);
      res.sendCreated201Response("Employee created successfully", employee);
    } catch (error) {
      logger.error("createEmployee", error);
      res.sendErrorResponse(
        (error as Error).message ?? "Error creating employee",
        error,
      );
    }
  };

  public updateEmployee = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const employee = await this.employeeService.updateEmployee(id, req.body);
      if (!employee) {
        res.sendNotFound404Response("Employee not found", null);
        return;
      }
      res.sendSuccess200Response("Employee updated successfully", employee);
    } catch (error) {
      logger.error("updateEmployee", error);
      res.sendErrorResponse("Error updating employee", error);
    }
  };

  public deleteEmployee = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.deleteEmployee(id);
      if (!employee) {
        res.sendNotFound404Response("Employee not found", null);
        return;
      }
      res.sendSuccess200Response("Employee deleted successfully", employee);
    } catch (error) {
      logger.error("deleteEmployee", error);
      res.sendErrorResponse("Error deleting employee", error);
    }
  };

  public loginEmployee = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.employeeService.loginEmployee(
        email,
        password,
        req.ip ?? "",
        req.headers["user-agent"] ?? "",
      );
      res.sendCreated201Response("Login successful", result);
    } catch (error) {
      logger.error("loginEmployee", error);
      res.sendErrorResponse(
        (error as Error).message ?? "Error during login",
        error,
      );
    }
  };
}

export default EmployeeController;
