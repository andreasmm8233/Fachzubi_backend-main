"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobSchema = exports.createJobSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createJobSchema = joi_1.default.object({
    newCity: joi_1.default.any().required(),
    industryName: joi_1.default.string().required(),
    company: joi_1.default.string().required(),
    jobTitle: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    additionalEmail: joi_1.default.optional(),
    address: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    jobDescription: joi_1.default.string().required(),
    attachments: joi_1.default.array(),
    status: joi_1.default.boolean().default(false),
});
exports.updateJobSchema = joi_1.default.object({
    id: joi_1.default.string(),
    city: joi_1.default.string(),
    industryName: joi_1.default.string(),
    company: joi_1.default.string(),
    jobTitle: joi_1.default.string(),
    email: joi_1.default.string().email(),
    additionalEmail: joi_1.default.optional(),
    address: joi_1.default.string(),
    zipCode: joi_1.default.string(),
    attachments: joi_1.default.array(),
    deletedAttachment: joi_1.default.any(),
    jobDescription: joi_1.default.string(),
});
//# sourceMappingURL=job.types.js.map