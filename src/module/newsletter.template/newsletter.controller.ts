import { type Request, type Response } from "express";
import { NewsletterService } from "./newsletter.service";
import logger from "../../utils/logger";

class NewsletterController {
  private readonly newsletterService: NewsletterService;

  constructor() {
    this.newsletterService = new NewsletterService();
  }

  // Public: newsletter form on the website
  public subscribe = async (req: Request, res: Response) => {
    try {
      const { subscriber, created } =
        await this.newsletterService.subscribeService(req.body.email);
      if (created) {
        res.sendCreated201Response("Subscribed successfully", subscriber);
      } else {
        res.sendSuccess200Response("Already subscribed", subscriber);
      }
    } catch (error) {
      logger.error("newsletter subscribe", error);
      res.sendErrorResponse("Error subscribing", error);
    }
  };

  public getSubscribers = async (req: Request, res: Response) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const page = Math.max(Number(pageNo) || 1, 1);
      const perPage = Math.max(Number(recordPerPage) || 10, 1);
      const { subscribers, total } =
        await this.newsletterService.getSubscribersService(
          (searchValue as string) || "",
          page,
          perPage,
        );
      res.sendSuccess200Response("Subscribers retrieved successfully", {
        subscribers,
        count: Math.ceil(total / perPage),
        total,
      });
    } catch (error) {
      logger.error("getSubscribers", error);
      res.sendErrorResponse("Error retrieving subscribers", error);
    }
  };

  public exportSubscribers = async (_req: Request, res: Response) => {
    try {
      const subscribers =
        await this.newsletterService.getAllSubscribersService();
      res.sendSuccess200Response("Subscribers exported successfully", {
        subscribers,
      });
    } catch (error) {
      logger.error("exportSubscribers", error);
      res.sendErrorResponse("Error exporting subscribers", error);
    }
  };

  public deleteSubscriber = async (req: Request, res: Response) => {
    try {
      const deleted = await this.newsletterService.deleteSubscriberService(
        req.params.id,
      );
      if (!deleted) {
        res.sendNotFound404Response("Subscriber not found", null);
        return;
      }
      res.sendSuccess200Response("Subscriber deleted successfully", deleted);
    } catch (error) {
      logger.error("deleteSubscriber", error);
      res.sendErrorResponse("Error deleting subscriber", error);
    }
  };
}

export default NewsletterController;
