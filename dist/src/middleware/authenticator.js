"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const user_service_1 = require("../module/user.template/user.service");
const index_1 = require("../models/index");
const logger_1 = __importDefault(require("../utils/logger"));
class AuthMiddleware {
    jwtService = new jwt_1.default();
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    verifyToken = async (req, _, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(" ")[1];
                const decodedToken = this.jwtService.verify(token);
                if (decodedToken.sessionId) {
                    const session = await this.userService.getUserSessionDetails({
                        _id: decodedToken.sessionId,
                        isValidSession: true,
                    });
                    if (session) {
                        const user = await this.userService.findById(session.userId);
                        if (user)
                            req.user = user;
                    }
                }
                else if (decodedToken.empSessionId) {
                    const session = await index_1.employeeSessionModel.findOne({
                        _id: decodedToken.empSessionId,
                        isValidSession: true,
                    });
                    if (session) {
                        const employee = await index_1.employeeModel.findById(session.employeeId);
                        if (employee)
                            req.employee = employee;
                    }
                }
            }
            next();
        }
        catch (error) {
            next();
            logger_1.default.error("verifyToken", error);
        }
    };
    requireAdmin = async (req, res, next) => {
        if (req.user) {
            next();
        }
        else {
            res.sendUnauthorized401Response("Unauthorized", null);
        }
    };
    requireUser = async (req, res, next) => {
        if (req.user || req.employee) {
            next();
        }
        else {
            res.sendUnauthorized401Response("Unauthorized", null);
        }
    };
    requirePermission = (permission) => async (req, res, next) => {
        if (req.user) {
            next();
            return;
        }
        if (req.employee) {
            if (req.employee.permissions[permission]) {
                next();
            }
            else {
                res.sendForbidden403Response("You do not have permission to access this section", null);
            }
            return;
        }
        next();
    };
    requireOwnership = (model, getId) => async (req, res, next) => {
        if (req.user || !req.employee) {
            next();
            return;
        }
        try {
            const id = getId(req);
            if (typeof id !== "string" || !mongoose_1.default.isValidObjectId(id)) {
                res.sendNotFound404Response("Record not found", null);
                return;
            }
            const owned = await model.exists({
                _id: id,
                createdBy: req.employee._id,
                createdByModel: "Employee",
            });
            if (owned) {
                next();
            }
            else {
                res.sendForbidden403Response("You can only access records you created", null);
            }
        }
        catch (error) {
            logger_1.default.error("requireOwnership", error);
            res.sendErrorResponse("Error checking record ownership", error);
        }
    };
}
exports.default = AuthMiddleware;
//# sourceMappingURL=authenticator.js.map