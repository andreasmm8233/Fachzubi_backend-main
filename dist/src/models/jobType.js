"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jobTypesSchema = new mongoose_1.Schema({
    jobTypeName: { type: String, required: true, unique: true },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const JobTypesModel = (0, mongoose_1.model)("JobTypes", jobTypesSchema);
exports.default = JobTypesModel;
//# sourceMappingURL=jobType.js.map