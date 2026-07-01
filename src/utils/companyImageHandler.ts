import mongoose from "mongoose";
import { companyImageModel } from "../models/index";
import logger from "./logger";
import { FileHandler } from "./fileHandler";

const isValidObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const isUploadedFile = (file: any): boolean =>
  Boolean(file) && typeof file === "object" && "data" in file;

export class CompanyImageHandler {
  private readonly fileHandler: FileHandler;
  constructor() {
    this.fileHandler = new FileHandler();
  }

  public async saveFileAndCreateMedia(
    files: any[],
    removeFile: any,
    companyId: string,
  ) {
    try {
      // Delete only entries that are valid ObjectIds (skip temp upload uids
      // like "rc-upload-…" and "undefined" that the frontend may send).
      const removeIds = (Array.isArray(removeFile) ? removeFile : [removeFile])
        .filter(isValidObjectId);
      if (removeIds.length) {
        await companyImageModel.deleteMany({ imageId: { $in: removeIds } });
      }

      if (files) {
        const newFiles: any[] = Array.isArray(files) ? files : [files];
        for (const file of newFiles) {
          if (!isUploadedFile(file)) continue; // skip strings / undefined
          const mediaId = await this.fileHandler.saveFileAndCreateMedia(file);
          if (!mediaId) continue; // skip failed saves (never store null imageId)
          await companyImageModel.create({ imageId: mediaId, companyId });
        }
      }
    } catch (error) {
      logger.error("saveFileAndCreateMedia", error);
    }
  }
}
