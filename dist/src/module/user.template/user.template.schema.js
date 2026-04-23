"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateProfileValidator = joi_1.default.object({
    newPassword: joi_1.default.string().min(6).optional(),
    oldPassword: joi_1.default.string().min(6).optional(),
    email: joi_1.default.string().email().optional(),
    username: joi_1.default.string().min(3).optional(),
});
//# sourceMappingURL=user.template.schema.js.map