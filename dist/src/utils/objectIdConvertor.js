"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class ObjectIdConverter {
    convertToObjectId(strId) {
        try {
            const objectId = new mongoose_1.default.Types.ObjectId(strId);
            return objectId;
        }
        catch (error) {
            return error;
        }
    }
}
exports.default = ObjectIdConverter;
//# sourceMappingURL=objectIdConvertor.js.map