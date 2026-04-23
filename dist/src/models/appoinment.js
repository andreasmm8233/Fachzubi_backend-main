"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appoinmentSchema = new mongoose_1.Schema({
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Employer", required: true },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    aboutMe: { type: String, required: false },
    coverLetter: { type: String, required: true },
}, {
    timestamps: true,
});
const appoinmentModel = (0, mongoose_1.model)("Appoinment", appoinmentSchema);
exports.default = appoinmentModel;
//# sourceMappingURL=appoinment.js.map