import mongoose from "mongoose";
import path from "path";
import { companyDocumentModel } from "../models/index";
import logger from "./logger";
import { FileHandler } from "./fileHandler";

// Only PDF and Word files are accepted as company documents.
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const isValidObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const isAllowedDocument = (file: any): boolean =>
  Boolean(file) &&
  typeof file === "object" &&
  "data" in file &&
  ALLOWED_EXTENSIONS.includes(path.extname(String(file.name)).toLowerCase());

export class CompanyDocumentHandler {
  private readonly fileHandler: FileHandler;
  constructor() {
    this.fileHandler = new FileHandler();
  }

  public async saveDocuments(
    files: any,
    removedDocuments: any,
    companyId: string,
  ) {
    try {
      const removeIds = (
        Array.isArray(removedDocuments) ? removedDocuments : [removedDocuments]
      ).filter(isValidObjectId);
      if (removeIds.length) {
        await companyDocumentModel.deleteMany({
          companyId,
          documentId: { $in: removeIds },
        });
      }

      if (files) {
        const newFiles: any[] = Array.isArray(files) ? files : [files];
        for (const file of newFiles) {
          if (!isAllowedDocument(file)) continue;
          const mediaId = await this.fileHandler.saveFileAndCreateMedia(file);
          if (!mediaId) continue;
          await companyDocumentModel.create({ documentId: mediaId, companyId });
        }
      }
    } catch (error) {
      logger.error("saveDocuments", error);
    }
  }
}
