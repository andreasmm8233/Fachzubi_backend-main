"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyImageHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../models/index");
const logger_1 = __importDefault(require("./logger"));
const fileHandler_1 = require("./fileHandler");
const isValidObjectId = (value) => typeof value === "string" && mongoose_1.default.Types.ObjectId.isValid(value);
const isUploadedFile = (file) => Boolean(file) && typeof file === "object" && "data" in file;
class CompanyImageHandler {
    fileHandler;
    constructor() {
        this.fileHandler = new fileHandler_1.FileHandler();
    }
    async saveFileAndCreateMedia(files, removeFile, companyId) {
        try {
            const removeIds = (Array.isArray(removeFile) ? removeFile : [removeFile])
                .filter(isValidObjectId);
            if (removeIds.length) {
                await index_1.companyImageModel.deleteMany({ imageId: { $in: removeIds } });
            }
            if (files) {
                const newFiles = Array.isArray(files) ? files : [files];
                for (const file of newFiles) {
                    if (!isUploadedFile(file))
                        continue;
                    const mediaId = await this.fileHandler.saveFileAndCreateMedia(file);
                    if (!mediaId)
                        continue;
                    await index_1.companyImageModel.create({ imageId: mediaId, companyId });
                }
            }
        }
        catch (error) {
            logger_1.default.error("saveFileAndCreateMedia", error);
        }
    }
}
exports.CompanyImageHandler = CompanyImageHandler;
//# sourceMappingURL=companyImageHandler.js.map