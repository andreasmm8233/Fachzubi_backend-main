"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPService = void 0;
const index_1 = require("../../models/index");
class SMTPService {
    async getSMTPSettings() {
        try {
            const smtpSettings = await index_1.smtpSettingModel.findOne();
            return smtpSettings;
        }
        catch (error) {
            throw new Error("Error fetching SMTP settings: " + error.message);
        }
    }
    async updateSMTPSettings(updatedData) {
        try {
            const updatedSMTPSettings = await index_1.smtpSettingModel.findOneAndUpdate({}, updatedData, {
                new: true,
                upsert: true,
            });
            return updatedSMTPSettings;
        }
        catch (error) {
            throw new Error("Error updating SMTP settings: " + error.message);
        }
    }
}
exports.SMTPService = SMTPService;
//# sourceMappingURL=smtp.service.js.map