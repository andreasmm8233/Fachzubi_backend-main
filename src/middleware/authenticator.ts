import { type Request, type Response, type NextFunction } from "express";
import JwtService from "../utils/jwt";
import { UserService } from "../module/user.template/user.service";
import { employeeModel, employeeSessionModel } from "../models/index";
import { type EmployeePermissions } from "../models/employee";
import logger from "../utils/logger";

class AuthMiddleware {
  private readonly jwtService = new JwtService();
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  verifyToken = async (req: Request, _: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        const decodedToken = this.jwtService.verify(token) as any;

        if (decodedToken.sessionId) {
          // Admin auth path
          const session = await this.userService.getUserSessionDetails({
            _id: decodedToken.sessionId,
            isValidSession: true,
          });
          if (session) {
            const user = await this.userService.findById(session.userId);
            if (user) req.user = user;
          }
        } else if (decodedToken.empSessionId) {
          // Employee auth path
          const session = await employeeSessionModel.findOne({
            _id: decodedToken.empSessionId,
            isValidSession: true,
          });
          if (session) {
            const employee = await employeeModel.findById(session.employeeId);
            if (employee) req.employee = employee;
          }
        }
      }
      next();
    } catch (error) {
      next();
      logger.error("verifyToken", error);
    }
  };

  // Admin only — used for routes employees must never access
  requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      next();
    } else {
      res.sendUnauthorized401Response("Unauthorized", null);
    }
  };

  // Any authenticated user (admin or employee)
  requireUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user || req.employee) {
      next();
    } else {
      res.sendUnauthorized401Response("Unauthorized", null);
    }
  };

  // Admin always passes; employee must have the specified permission
  requirePermission =
    (permission: keyof EmployeePermissions) =>
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user) {
        next();
        return;
      }
      if (req.employee) {
        if (req.employee.permissions[permission]) {
          next();
        } else {
          res.sendForbidden403Response(
            "You do not have permission to access this section",
            null,
          );
        }
        return;
      }
      // Not authenticated — let the route's own requireUser handle it
      next();
    };
}

export default AuthMiddleware;
