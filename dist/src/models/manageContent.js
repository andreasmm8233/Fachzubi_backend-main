"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const manageContentSchema = new mongoose_1.Schema({
    privacyPolicy: { type: String, required: true },
    termsConditions: { type: String, required: true },
    jobCoverLetter: { type: String, required: true },
    appointment: { type: String, required: true },
    heading: { type: String, required: true },
    subHeading: { type: String, required: true },
    bottomBarText: { type: String, required: true },
}, {
    timestamps: true,
});
const _ManageContentModel = (0, mongoose_1.model)("ManageContent", manageContentSchema);
exports.default = _ManageContentModel;
//# sourceMappingURL=manageContent.js.map