"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpUpdateValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.smtpUpdateValidator = joi_1.default.object({
    host: joi_1.default.string().required(),
    port: joi_1.default.number().required(),
    userName: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    encryption: joi_1.default.string().required(),
}).options({ abortEarly: false });
//# sourceMappingURL=smtp.schema.js.map