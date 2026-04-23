"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyImageHandler = void 0;
const index_1 = require("../models/index");
const logger_1 = __importDefault(require("./logger"));
const fileHandler_1 = require("./fileHandler");
class CompanyImageHandler {
    fileHandler;
    constructor() {
        this.fileHandler = new fileHandler_1.FileHandler();
    }
    async saveFileAndCreateMedia(files, removeFile, companyId) {
        try {
            if (removeFile) {
                try {
                    for (let i = 0; i < removeFile.length; i++) {
                        await index_1.companyImageModel.deleteMany({
                            imageId: removeFile[i],
                        });
                    }
                }
                catch (error) {
                    await index_1.companyImageModel.deleteMany({
                        imageId: removeFile,
                    });
                }
            }
            if (files) {
                try {
                    let newFiles = [];
                    if (!files.length) {
                        newFiles.push(files);
                    }
                    else {
                        newFiles = files;
                    }
                    for (let i = 0; i < newFiles.length; i++) {
                        const mediaId = await this.fileHandler.saveFileAndCreateMedia(newFiles[i]);
                        await index_1.companyImageModel.create({
                            imageId: mediaId,
                            companyId,
                        });
                    }
                }
                catch (error) {
                    const mediaId = await this.fileHandler.saveFileAndCreateMedia(files);
                    await index_1.companyImageModel.create({
                        imageId: mediaId,
                        companyId,
                    });
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