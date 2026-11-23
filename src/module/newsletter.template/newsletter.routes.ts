import express from "express";
import NewsletterController from "./newsletter.controller";
import AuthMiddleware from "../../middleware/authenticator";
import JoiValidator from "../../utils/joiValidator";
import { subscribeValidator } from "./newsletter.schema";

const newsletterRoute = express.Router();
const newsletterController = new NewsletterController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();

// Public
newsletterRoute.post(
  "/subscribe",
  joiValidator.validate(subscribeValidator, "body"),
  newsletterController.subscribe,
);

// Admin panel
newsletterRoute.get(
  "/",
  authMiddleware.requireUser,
  newsletterController.getSubscribers,
);
newsletterRoute.get(
  "/export",
  authMiddleware.requireUser,
  newsletterController.exportSubscribers,
);
newsletterRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  newsletterController.deleteSubscriber,
);

export default newsletterRoute;
