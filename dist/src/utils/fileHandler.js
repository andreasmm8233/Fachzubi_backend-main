"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandler = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const index_1 = require("../models/index");
const logger_1 = __importDefault(require("./logger"));
class FileHandler {
    async saveFileAndCreateMedia(file) {
        try {
            if (!Buffer.isBuffer(file.data)) {
                throw new Error("Invalid buffer type");
            }
            const actualFileName = file.name;
            const fileName = `${Date.now()}-${file.name}`;
            const publicDir = path_1.default.join(process.cwd(), "public");
            const absoluteFilePath = path_1.default.join(publicDir, fileName);
            await promises_1.default.mkdir(publicDir, { recursive: true });
            await promises_1.default.writeFile(absoluteFilePath, file.data);
            const mediaData = {
                type: file.mimetype,
                fileName: actualFileName,
                filepath: fileName,
            };
            const createdMedia = await index_1.mediaModel.create(mediaData);
            return createdMedia._id;
        }
        catch (error) {
            logger_1.default.error("saveFileAndCreateMedia", error);
            return null;
        }
    }
}
exports.FileHandler = FileHandler;
//# sourceMappingURL=fileHandler.js.map