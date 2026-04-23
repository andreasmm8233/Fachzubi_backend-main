"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const industriesSchema = new mongoose_1.Schema({
    industryName: { type: String, required: true },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const _IndustriesModel = (0, mongoose_1.model)("Industries", industriesSchema);
exports.default = _IndustriesModel;
//# sourceMappingURL=industries.js.map