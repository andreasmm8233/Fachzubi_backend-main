"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manageKey_service_1 = require("./manageKey.service");
const logger_1 = __importDefault(require("../../utils/logger"));
class ManageKeyController {
    manageKeyService;
    constructor() {
        this.manageKeyService = new manageKey_service_1.ManageKeyService();
    }
    getAllKeys = async (_, res) => {
        try {
            const keys = await this.manageKeyService.getAllKeysService();
            res.sendSuccess200Response("Keys retrieved successfully", keys);
        }
        catch (error) {
            logger_1.default.error("getAllKeys", error);
            res.sendErrorResponse("Error retrieving keys", error);
        }
    };
    editKey = async (req, res) => {
        try {
            const updatedKey = await this.manageKeyService.editKeyService(req.body);
            res.sendSuccess200Response("Key edited successfully", updatedKey);
        }
        catch (error) {
            logger_1.default.error("editKey", error);
            res.sendErrorResponse("Error editing key", error);
        }
    };
}
exports.default = ManageKeyController;
//# sourceMappingURL=manageKey.controller.js.map