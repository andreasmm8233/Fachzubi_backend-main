"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jobDocumentSchema = new mongoose_1.Schema({
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "job",
        required: true,
    },
    document: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
    },
});
const _JobDocumentModel = (0, mongoose_1.model)("JobDocument", jobDocumentSchema);
exports.default = _JobDocumentModel;
//# sourceMappingURL=jobDocument.js.map