"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageContentService = void 0;
const index_1 = require("../../models/index");
class ManageContentService {
    async getAllContentService() {
        const result = await index_1.manageContentModel.findOne();
        if (result) {
            result.id = result._id;
        }
        return result;
    }
    async editContentService(updatedData) {
        return await index_1.manageContentModel.findOneAndUpdate({}, updatedData, {
            new: true,
            upsert: true,
        });
    }
}
exports.ManageContentService = ManageContentService;
//# sourceMappingURL=manage.content.service.js.map