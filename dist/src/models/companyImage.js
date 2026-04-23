"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const companyImage = new mongoose_2.Schema({
    companyId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    imageId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
}, {
    timestamps: true,
});
const _companyImageModel = (0, mongoose_2.model)("CompanyImages", companyImage);
exports.default = _companyImageModel;
//# sourceMappingURL=companyImage.js.map