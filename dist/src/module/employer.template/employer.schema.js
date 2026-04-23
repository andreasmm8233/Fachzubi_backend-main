"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployerSchema = exports.createEmployerBodyValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createEmployerBodyValidator = joi_1.default.object({
    industryName: joi_1.default.string().required(),
    contactPerson: joi_1.default.string().required(),
    jobTitle: joi_1.default.string().required(),
    companyName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    website: joi_1.default.string().required(),
    phoneNo: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    companyDescription: joi_1.default.string().required(),
    videoLink: joi_1.default.any().optional(),
    city: joi_1.default.string().required(),
    status: joi_1.default.boolean(),
});
exports.updateEmployerSchema = joi_1.default.object({
    industryName: joi_1.default.string().optional(),
    jobTitle: joi_1.default.string().optional(),
    companyName: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    website: joi_1.default.string().optional(),
    phoneNo: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
    zipCode: joi_1.default.string().optional(),
    companyLogo: joi_1.default.any().optional(),
    companyDescription: joi_1.default.string().optional(),
    videoLink: joi_1.default.any().optional(),
    city: joi_1.default.string().optional(),
    status: joi_1.default.boolean().optional(),
    contactPerson: joi_1.default.string().optional(),
    id: joi_1.default.string(),
});
//# sourceMappingURL=employer.schema.js.map