"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("../user.template/user.service");
const auth_service_1 = require("./auth.service");
class AuthController {
    userService;
    authService;
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
            if (!user) {
                res.sendNotFound404Response("User not found", null);
                return;
            }
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
            });
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