"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const smtpSettingSchema = new mongoose_1.Schema({
    host: { type: String, required: true },
    userName: { type: String, required: true },
    encryption: { type: String, required: true },
    port: { type: Number, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    service: { type: String, required: true },
}, {
    timestamps: true,
});
const _SmtpSettingModel = (0, mongoose_1.model)("SmtpSetting", smtpSettingSchema);
exports.default = _SmtpSettingModel;
//# sourceMappingURL=smtp.js.map