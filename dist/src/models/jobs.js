"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    jobType: { type: mongoose_1.Schema.Types.ObjectId, required: false },
    videoLink: { type: [{ type: String }], required: false },
    city: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "City", required: true }],
    industryName: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Industries",
        required: true,
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Employer",
        required: true,
    },
    jobTitle: { type: String, required: true },
    startDate: { type: Date, required: false },
    email: { type: String, required: true },
    additionalEmail: { type: String },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    jobDescription: { type: String, required: true },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
}, {
    timestamps: true,
});
const _JobModel = (0, mongoose_1.model)("Job", jobSchema);
exports.default = _JobModel;
//# sourceMappingURL=jobs.js.map