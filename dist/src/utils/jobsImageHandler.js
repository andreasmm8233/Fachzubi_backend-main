"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobImageHandler = void 0;
const index_1 = require("../models/index");
const logger_1 = __importDefault(require("./logger"));
const fileHandler_1 = require("./fileHandler");
class JobImageHandler {
    fileHandler;
    constructor() {
        this.fileHandler = new fileHandler_1.FileHandler();
    }
    async saveFileAndCreateMedia(files, removeFile, jobId) {
        try {
            if (removeFile) {
                try {
                    for (let i = 0; i < removeFile.length; i++) {
                        await index_1.jobImagesModel.deleteMany({
                            imageId: removeFile[i],
                        });
                    }
                }
                catch (error) {
                    await index_1.jobImagesModel.deleteMany({
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
                        await index_1.jobImagesModel.create({
                            imageId: mediaId,
                            jobId,
                        });
                    }
                }
                catch (error) {
                    const mediaId = await this.fileHandler.saveFileAndCreateMedia(files);
                    await index_1.jobImagesModel.create({
                        imageId: mediaId,
                        jobId,
                    });
                }
            }
        }
        catch (error) {
            logger_1.default.error("saveFileAndCreateMedia", error);
        }
    }
}
exports.JobImageHandler = JobImageHandler;
//# sourceMappingURL=jobsImageHandler.js.map