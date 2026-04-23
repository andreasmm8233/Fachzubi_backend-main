"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = __importDefault(require("../utils/jwt"));
const user_service_1 = require("../module/user.template/user.service");
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
                const session = await this.userService.getUserSessionDetails({
                    _id: decodedToken.sessionId,
                    isValidSession: true,
                });
                if (session) {
                    const user = await this.userService.findById(session?.userId);
                    if (user) {
                        req.user = user;
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
    requireUser = async (req, res, next) => {
        if (req.user) {
            next();
        }
        else {
            res.sendUnauthorized401Response("Unauthorized", null);
        }
    };
}
exports.default = AuthMiddleware;
//# sourceMappingURL=authenticator.js.map