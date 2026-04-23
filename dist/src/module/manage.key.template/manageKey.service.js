"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageKeyService = void 0;
const index_1 = require("../../models/index");
class ManageKeyService {
    async getAllKeysService() {
        const keys = await index_1.manageKeyModel.findOne();
        return keys;
    }
    async editKeyService(updatedData) {
        const updatedKey = await index_1.manageKeyModel.findOneAndUpdate({}, updatedData, {
            new: true,
            upsert: true,
        });
        return updatedKey;
    }
}
exports.ManageKeyService = ManageKeyService;
//# sourceMappingURL=manageKey.service.js.map