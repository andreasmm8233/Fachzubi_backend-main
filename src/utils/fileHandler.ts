import path from "path";
import fs from "fs/promises"; // Import fs.promises for asynchronous file operations
import { mediaModel } from "../models/index";
import { type Media } from "../models/media";
import logger from "./logger";
export class FileHandler {
  public async saveFileAndCreateMedia(file: any): Promise<string | null> {
    try {
      // Ensure file.data is a Buffer
      if (!Buffer.isBuffer(file.data)) {
        throw new Error("Invalid buffer type");
      }

      // Generate a unique file name using the current timestamp
      const actualFileName = file.name;
      const fileName = Date.now() + "-" + file.name;
      const filePath = path.join("public", fileName).replace(/\\/g, "/");
      await fs.mkdir(path.join(__dirname, "../../public"), { recursive: true });
      // Save the file to the 'public' folder
      await fs.writeFile(filePath, file.data);

      // Create a media document in your MongoDB collection
      const fileType = file.mimetype;
      const mediaData: Media = {
        type: fileType,
        fileName:actualFileName,
        filepath: filePath.replace(/^public\//, ""),
      };
      const createdMedia = await mediaModel.create(mediaData);

      // Return the ID of the created media document
      return createdMedia._id;
    } catch (error) {
      logger.error("saveFileAndCreateMedia", error);
      return null;
    }
  }
}
