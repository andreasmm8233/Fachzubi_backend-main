"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessTokenFromRefreshTokenValidator = exports.loginUserBodyValidator = exports.createUserBodyValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserBodyValidator = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
exports.loginUserBodyValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
});
exports.generateAccessTokenFromRefreshTokenValidator = joi_1.default.object({
    token: joi_1.default.string().required(),
});
//# sourceMappingURL=auth.schema.js.map