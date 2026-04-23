"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_schema_1 = require("./auth.schema");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const joiValidator_1 = __importDefault(require("../../utils/joiValidator"));
const authRoute = express_1.default.Router();
const authController = new auth_controller_1.default();
const joiValidator = new joiValidator_1.default();
authRoute.post("/create-user", joiValidator.validate(auth_schema_1.createUserBodyValidator, "body"), authController.createUser);
authRoute.post("/login-user", joiValidator.validate(auth_schema_1.loginUserBodyValidator, "body"), authController.loginUser);
authRoute.post("/refresh-access-token", joiValidator.validate(auth_schema_1.generateAccessTokenFromRefreshTokenValidator, "body"), authController.generateAccessTokenFromRefreshToken);
exports.default = authRoute;
//# sourceMappingURL=auth.routes.js.map