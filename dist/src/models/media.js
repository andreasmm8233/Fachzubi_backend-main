"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    fileName: { type: String, required: true },
    filepath: { type: String, required: true },
}, {
    timestamps: true,
});
const _MediaModel = (0, mongoose_1.model)("Media", mediaSchema);
exports.default = _MediaModel;
//# sourceMappingURL=media.js.map