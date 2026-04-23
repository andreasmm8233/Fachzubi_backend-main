"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const manageKeySchema = new mongoose_1.Schema({
    hostKey: { type: String, required: true },
    portKey: { type: String, required: true },
    notificationKey: { type: String, required: true },
}, {
    timestamps: true,
});
const _ManageKeyModel = (0, mongoose_1.model)("ManageKey", manageKeySchema);
exports.default = _ManageKeyModel;
//# sourceMappingURL=manageKey.js.map