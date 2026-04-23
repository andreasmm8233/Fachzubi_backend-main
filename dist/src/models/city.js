"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const citySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    startTime: { type: Date },
    endTime: { type: Date },
    address: { type: String },
    zipCode: { type: String },
    directionLink: { type: String },
    status: { type: Boolean, required: true, default: true },
}, {
    timestamps: true,
});
const CityModel = (0, mongoose_1.model)("City", citySchema);
exports.default = CityModel;
//# sourceMappingURL=city.js.map