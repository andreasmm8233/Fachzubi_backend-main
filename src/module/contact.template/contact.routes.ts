import express from "express";
import ContactController from "./contact.controller";
import AuthMiddleware from "../../middleware/authenticator";
import JoiValidator from "../../utils/joiValidator";
import { addContactQueryValidator } from "./contact.schema";

const contactRoute = express.Router();
const contactController = new ContactController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();

contactRoute.post(
  "/",
  joiValidator.validate(addContactQueryValidator, "body"),
  contactController.addContactQuery,
);
contactRoute.get(
  "/",
  authMiddleware.requireUser,
  contactController.getContactQueries,
);
contactRoute.delete(
  "/:id",
  authMiddleware.requireUser,
  contactController.deleteContactQuery,
);

export default contactRoute;
