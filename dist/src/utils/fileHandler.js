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
            const fileName = Date.now() + "-" + file.name;
            const filePath = path_1.default.join("public", fileName).replace(/\\/g, "/");
            await promises_1.default.mkdir(path_1.default.join(__dirname, "../../public"), { recursive: true });
            await promises_1.default.writeFile(filePath, file.data);
            const fileType = file.mimetype;
            const mediaData = {
                type: fileType,
                fileName: actualFileName,
                filepath: filePath.replace(/^public\//, ""),
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