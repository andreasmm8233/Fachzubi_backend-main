"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    jobId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Job", required: true },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    aboutMe: { type: String, required: false },
    coverLetter: { type: String, required: true },
}, {
    timestamps: true,
});
const applicationModel = (0, mongoose_1.model)("Application", applicationSchema);
exports.default = applicationModel;
//# sourceMappingURL=jobApplication.js.map