"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editKeyValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.editKeyValidator = joi_1.default.object({
    hostKey: joi_1.default.string().required(),
    portKey: joi_1.default.string().required(),
    pushNotificationKey: joi_1.default.string().required(),
});
//# sourceMappingURL=manageKey.schema.js.map