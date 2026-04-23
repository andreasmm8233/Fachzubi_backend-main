"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_1 = __importDefault(require("../../utils/jwt"));
const user_service_1 = require("../user.template/user.service");
const logger_1 = __importDefault(require("../../utils/logger"));
class AuthService {
    jwtService = new jwt_1.default();
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    createAccessToken(payload) {
        return this.jwtService.sign(payload, { expiresIn: "1h" });
    }
    createRefreshToken(payload) {
        return this.jwtService.sign(payload, { expiresIn: "30d" });
    }
    async getAccessTokenFromRefreshToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            if (!decoded) {
                return null;
            }
            const { sessionId } = decoded;
            const userSession = await this.userService.getUserSessionDetailsBySessionId(sessionId);
            if (!userSession?.isValidSession) {
                return null;
            }
            const userDetails = await this.userService.findById(userSession.userId);
            if (userDetails) {
                const accessTokenPayload = {
                    sessionId: userSession._id,
                };
                const accessToken = this.createAccessToken(accessTokenPayload);
                return accessToken;
            }
            return null;
        }
        catch (error) {
            logger_1.default.error("getAccessTokenFromRefreshToken", error);
            return null;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map