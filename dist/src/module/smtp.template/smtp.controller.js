"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smtp_service_1 = require("./smtp.service");
const logger_1 = __importDefault(require("../../utils/logger"));
class SMTPController {
    smtpService;
    constructor() {
        this.smtpService = new smtp_service_1.SMTPService();
    }
    getSMTPSettings = async (_, res) => {
        try {
            const smtpSettings = await this.smtpService.getSMTPSettings();
            res.sendSuccess200Response("SMTP settings retrieved successfully", smtpSettings);
        }
        catch (error) {
            logger_1.default.error("getSMTPSettings", error);
            res.sendErrorResponse("Error retrieving SMTP settings", error);
        }
    };
    updateSMTPSettings = async (req, res) => {
        try {
            const updatedSMTPSettings = await this.smtpService.updateSMTPSettings(req.body);
            res.sendSuccess200Response("SMTP settings updated successfully", updatedSMTPSettings);
        }
        catch (error) {
            logger_1.default.error("updateSMTPSettings", error);
            res.sendErrorResponse("Error updating SMTP settings", error);
        }
    };
}
exports.default = SMTPController;
//# sourceMappingURL=smtp.controller.js.map