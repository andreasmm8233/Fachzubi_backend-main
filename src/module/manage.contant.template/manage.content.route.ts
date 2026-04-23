import express from "express";
import AuthMiddleware from "../../middleware/authenticator";
import ManageContentController from "./manage.content.controller";
import JoiValidator from "../../utils/joiValidator";
import { editContentValidator } from "./manage.content.schema";

const manageContentRoute = express.Router();
const manageContentController = new ManageContentController();
const authMiddleware = new AuthMiddleware();
const joiValidator = new JoiValidator();
manageContentRoute.get(
  "/",
  manageContentController.getAllContent,
);

manageContentRoute.put(
  "/",
  authMiddleware.requireUser,
  joiValidator.validate(editContentValidator, "body"),
  manageContentController.editContent,
);

export default manageContentRoute;
