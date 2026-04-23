"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const employerSchema = new mongoose_1.Schema({
    industryName: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: false,
        ref: "Industries",
    },
    contactPerson: { type: String, required: false },
    jobTitle: { type: String, required: false },
    companyName: { type: String, required: false },
    email: { type: String, required: false },
    website: { type: String, required: false },
    phoneNo: { type: String, required: false },
    address: { type: String, required: false },
    zipCode: { type: String, required: false },
    companyLogo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: false,
        ref: "Media",
    },
    companyDescription: { type: String, required: false },
    videoLink: { type: [{ type: String }], required: false },
    city: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: false,
        ref: "City",
    },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
}, {
    timestamps: false,
});
const _EmployerModel = (0, mongoose_1.model)("Employer", employerSchema);
exports.default = _EmployerModel;
//# sourceMappingURL=employer.js.map