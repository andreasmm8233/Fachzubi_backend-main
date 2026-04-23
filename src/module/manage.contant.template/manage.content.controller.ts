import { type Request, type Response } from "express";
import { ManageContentService } from "./manage.content.service";
import logger from "../../utils/logger";

class ManageContentController {
  private readonly manageContentService: ManageContentService;

  constructor() {
    this.manageContentService = new ManageContentService();
  }

  public getAllContent = async (_, res: Response) => {
    try {
      const content = await this.manageContentService.getAllContentService();
      res.sendSuccess200Response("Content retrieved successfully", content);
    } catch (error) {
      logger.error("getAllContent", error);
      res.sendErrorResponse("Error retrieving content", error);
    }
  };

  public editContent = async (req: Request, res: Response) => {
    try {
      const updatedContent = await this.manageContentService.editContentService(
        req.body,
      );
      res.sendSuccess200Response("Content edited successfully", updatedContent);
    } catch (error) {
      logger.error("editContent", error);
      res.sendErrorResponse("Error editing content", error);
    }
  };
}

export default ManageContentController;
