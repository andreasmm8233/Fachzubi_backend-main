"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manage_content_service_1 = require("./manage.content.service");
const logger_1 = __importDefault(require("../../utils/logger"));
class ManageContentController {
    manageContentService;
    constructor() {
        this.manageContentService = new manage_content_service_1.ManageContentService();
    }
    getAllContent = async (_, res) => {
        try {
            const content = await this.manageContentService.getAllContentService();
            res.sendSuccess200Response("Content retrieved successfully", content);
        }
        catch (error) {
            logger_1.default.error("getAllContent", error);
            res.sendErrorResponse("Error retrieving content", error);
        }
    };
    editContent = async (req, res) => {
        try {
            const updatedContent = await this.manageContentService.editContentService(req.body);
            res.sendSuccess200Response("Content edited successfully", updatedContent);
        }
        catch (error) {
            logger_1.default.error("editContent", error);
            res.sendErrorResponse("Error editing content", error);
        }
    };
}
exports.default = ManageContentController;
//# sourceMappingURL=manage.content.controller.js.map