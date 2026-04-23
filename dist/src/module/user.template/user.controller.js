"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("./user.service");
const jwt_1 = __importDefault(require("../../utils/jwt"));
const emailService_1 = __importDefault(require("../../utils/emailService"));
const logger_1 = __importDefault(require("../../utils/logger"));
const auth_service_1 = require("../auth.template/auth.service");
const job_service_1 = require("../job.template/job.service");
const employer_service_1 = require("../employer.template/employer.service");
class UserController {
    userService;
    jwtService = new jwt_1.default();
    authService;
    jobService;
    employerService;
    constructor() {
        this.jobService = new job_service_1.JobService();
        this.userService = new user_service_1.UserService();
        this.authService = new auth_service_1.AuthService();
        this.employerService = new employer_service_1.EmployerService();
    }
    getUser = async (req, res) => {
        try {
            const { _id } = req.user;
            const user = await this.userService.findOneWithOptions({ _id });
            res.sendCreated201Response("User created successfully", user);
        }
        catch (error) {
            res.sendErrorResponse("Error creating user", error);
        }
    };
    updateProfile = async (req, res) => {
        try {
            const { _id } = req.user;
            const { newPassword, oldPassword, ...otherProfileFields } = req.body;
            await this.userService.updateProfile(_id, newPassword, oldPassword, otherProfileFields);
            res.sendSuccess200Response("Profile updated successfully", null);
        }
        catch (error) {
            res.sendErrorResponse("Error updating profile", error);
        }
    };
    getForPasswordLink = async (req, res) => {
        try {
            const { email } = req.params;
            const user = await this.userService.findOneWithOptions({ email });
            if (!user) {
                res.sendCustomErrorResponse("user not found", null);
            }
            else {
                const payload = {
                    id: user._id,
                };
                const resetToken = this.jwtService.sign(payload, { expiresIn: "1h" });
                const resetLink = `${process.env.FRONTEND_URL}/${process.env.RESET_PASSWORD}?token=${resetToken}`;
                const emailOptions = {
                    to: user.email,
                    subject: "Password Reset Request",
                    html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
                };
                await emailService_1.default.sendEmail(emailOptions);
                res.sendSuccess200Response("Password reset email sent successfully", null);
            }
        }
        catch (error) {
            logger_1.default.error("getForPasswordLink", error);
            res.sendErrorResponse("Error ", error);
        }
    };
    resetPassword = async (req, res) => {
        try {
            const { token, password } = req.body;
            const decoded = this.jwtService.verify(token);
            const user = await this.userService.findOneWithOptions({
                _id: decoded.id,
            });
            if (user) {
                const payload = {
                    userAgent: req.headers["user-agent"] ?? "",
                    ipAddress: req.ip ?? "",
                    userId: user._id,
                };
                await this.userService.updateForgetPassword(user._id, password);
                const session = await this.userService.createSession(payload);
                const accessTokenPayload = {
                    sessionId: session._id,
                };
                const refreshTokenPayload = {
                    sessionId: session._id,
                };
                const accessToken = this.authService.createAccessToken(accessTokenPayload);
                const refreshToken = this.authService.createRefreshToken(refreshTokenPayload);
                res.sendCreated201Response("password reset Success", {
                    accessToken,
                    refreshToken,
                });
            }
        }
        catch (error) {
            logger_1.default.error("resetPassword", error);
            res.sendErrorResponse("resetPassword ", error);
        }
    };
    getAllDashBoardDataHandler = async (_, res) => {
        try {
            const jobs = await this.jobService.getCount();
            const employer = await this.employerService.getCount();
            const application = await this.jobService.getApplicationCount();
            const appoinment = await this.employerService.getAppoinmentCount();
            res.sendSuccess200Response("Password reset email sent successfully", {
                jobs,
                employer,
                application,
                appoinment
            });
        }
        catch (error) {
            logger_1.default.error("getForPasswordLink", error);
            res.sendErrorResponse("Error ", error);
        }
    };
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map