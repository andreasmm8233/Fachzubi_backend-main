"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const jobImages = new mongoose_2.Schema({
    jobId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    imageId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
}, {
    timestamps: true,
});
const _jobImagesModel = (0, mongoose_2.model)("jobImages", jobImages);
exports.default = _jobImagesModel;
//# sourceMappingURL=jobImages.js.map