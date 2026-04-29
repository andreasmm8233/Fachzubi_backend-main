import path from "path";
import fs from "fs/promises"; // Import fs.promises for asynchronous file operations
import { mediaModel } from "../models/index";
import { type Media } from "../models/media";
import logger from "./logger";
export class FileHandler {
  public async saveFileAndCreateMedia(file: any): Promise<string | null> {
    try {
      if (!Buffer.isBuffer(file.data)) {
        throw new Error("Invalid buffer type");
      }

      const actualFileName = file.name;
      const fileName = `${Date.now()}-${file.name}`;

      // Use process.cwd() so mkdir and writeFile always point to the same directory
      const publicDir = path.join(process.cwd(), "public");
      const absoluteFilePath = path.join(publicDir, fileName);

      await fs.mkdir(publicDir, { recursive: true });
      await fs.writeFile(absoluteFilePath, file.data);

      const mediaData: Media = {
        type: file.mimetype,
        fileName: actualFileName,
        filepath: fileName, // stored as filename only; served via express.static("/public")
      };
      const createdMedia = await mediaModel.create(mediaData);

      return createdMedia._id;
    } catch (error) {
      logger.error("saveFileAndCreateMedia", error);
      return null;
    }
  }
}
