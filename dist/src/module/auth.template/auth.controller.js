"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("../user.template/user.service");
const auth_service_1 = require("./auth.service");
const index_1 = require("../../models/index");
const jwt_1 = __importDefault(require("../../utils/jwt"));
const ALL_PERMISSIONS = {
    manage_jobs: true,
    manage_cities: true,
    manage_employers: true,
    manage_industries: true,
    job_types: true,
    manage_content: true,
};
class AuthController {
    userService;
    authService;
    jwtService = new jwt_1.default();
    constructor() {
        this.userService = new user_service_1.UserService();
        this.authService = new auth_service_1.AuthService();
    }
    createUser = async (req, res) => {
        try {
            const user = await this.userService.create(req.body);
            res.sendCreated201Response("User created successfully", user);
        }
        catch (error) {
            res.sendErrorResponse("Error creating user", error);
        }
    };
    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await this.userService.findOneWithOptions({ email });
            if (user) {
                const isPasswordMatch = await user.comparePassword(password);
                if (!isPasswordMatch) {
                    res.sendUnauthorized401Response("Incorrect password", null);
                    return;
                }
                const payload = {
                    userAgent: req.headers["user-agent"] ?? "",
                    ipAddress: req.ip ?? "",
                    userId: user._id,
                };
                const session = await this.userService.createSession(payload);
                const accessTokenPayload = {
                    sessionId: session._id,
                };
                const refreshTokenPayload = {
                    sessionId: session._id,
                };
                const accessToken = this.authService.createAccessToken(accessTokenPayload);
                const refreshToken = this.authService.createRefreshToken(refreshTokenPayload);
                res.sendCreated201Response("Login successful", {
                    accessToken,
                    refreshToken,
                    role: "admin",
                    permissions: ALL_PERMISSIONS,
                });
                return;
            }
            const employee = await index_1.employeeModel.findOne({
                email,
                isDeleted: false,
                isActive: true,
            });
            if (employee) {
                const isPasswordMatch = await employee.comparePassword(password);
                if (!isPasswordMatch) {
                    res.sendUnauthorized401Response("Incorrect password", null);
                    return;
                }
                const session = await index_1.employeeSessionModel.create({
                    employeeId: employee._id,
                    ipAddress: req.ip ?? "",
                    userAgent: req.headers["user-agent"] ?? "",
                });
                const accessToken = this.jwtService.sign({ empSessionId: String(session._id) }, { expiresIn: "1h" });
                const refreshToken = this.jwtService.sign({ empSessionId: String(session._id) }, { expiresIn: "30d" });
                const employeeObj = employee.toObject();
                delete employeeObj.password;
                res.sendCreated201Response("Login successful", {
                    accessToken,
                    refreshToken,
                    role: "employee",
                    permissions: employee.permissions,
                    employee: employeeObj,
                });
                return;
            }
            res.sendNotFound404Response("Invalid email or password", null);
        }
        catch (error) {
            res.sendErrorResponse("Error during login", error);
        }
    };
    generateAccessTokenFromRefreshToken = async (req, res) => {
        const { token } = req.body;
        const accessToken = await this.authService.getAccessTokenFromRefreshToken(token);
        if (!accessToken) {
            res.sendUnauthorized401Response("Refresh token expired. Please re-authenticate to generate a new token.", {});
        }
        else {
            res.sendSuccess200Response("New access token generated successfully.", {
                accessToken,
            });
        }
    };
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map