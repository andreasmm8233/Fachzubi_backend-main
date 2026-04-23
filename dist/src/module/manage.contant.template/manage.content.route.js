"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const manage_content_controller_1 = __importDefault(require("./manage.content.controller"));
const joiValidator_1 = __importDefault(require("../../utils/joiValidator"));
const manage_content_schema_1 = require("./manage.content.schema");
const manageContentRoute = express_1.default.Router();
const manageContentController = new manage_content_controller_1.default();
const authMiddleware = new authenticator_1.default();
const joiValidator = new joiValidator_1.default();
manageContentRoute.get("/", manageContentController.getAllContent);
manageContentRoute.put("/", authMiddleware.requireUser, joiValidator.validate(manage_content_schema_1.editContentValidator, "body"), manageContentController.editContent);
exports.default = manageContentRoute;
//# sourceMappingURL=manage.content.route.js.map