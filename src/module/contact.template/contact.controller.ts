import { type Request, type Response } from "express";
import { ContactService } from "./contact.service";
import logger from "../../utils/logger";

class ContactController {
  private readonly contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  }

  // Public: contact form on the website
  public addContactQuery = async (req: Request, res: Response) => {
    try {
      const { companyName, email, phoneNo, description } = req.body;
      const query = await this.contactService.addContactQueryService({
        companyName,
        email,
        phoneNo,
        description,
      });
      res.sendCreated201Response("Message sent successfully", query);
    } catch (error) {
      logger.error("addContactQuery", error);
      res.sendErrorResponse("Error sending message", error);
    }
  };

  public getContactQueries = async (req: Request, res: Response) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const page = Math.max(Number(pageNo) || 1, 1);
      const perPage = Math.max(Number(recordPerPage) || 10, 1);
      const { queries, total } =
        await this.contactService.getContactQueriesService(
          (searchValue as string) || "",
          page,
          perPage,
        );
      res.sendSuccess200Response("Contact queries retrieved successfully", {
        queries,
        count: Math.ceil(total / perPage),
        total,
      });
    } catch (error) {
      logger.error("getContactQueries", error);
      res.sendErrorResponse("Error retrieving contact queries", error);
    }
  };

  public deleteContactQuery = async (req: Request, res: Response) => {
    try {
      const deleted = await this.contactService.deleteContactQueryService(
        req.params.id,
      );
      if (!deleted) {
        res.sendNotFound404Response("Contact query not found", null);
        return;
      }
      res.sendSuccess200Response("Contact query deleted successfully", deleted);
    } catch (error) {
      logger.error("deleteContactQuery", error);
      res.sendErrorResponse("Error deleting contact query", error);
    }
  };
}

export default ContactController;
