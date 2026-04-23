"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const smtp_controller_1 = __importDefault(require("./smtp.controller"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const smtp_schema_1 = require("./smtp.schema");
const joiValidator_1 = __importDefault(require("../../utils/joiValidator"));
const smtpRoute = express_1.default.Router();
const smtpController = new smtp_controller_1.default();
const authMiddleware = new authenticator_1.default();
const joiValidator = new joiValidator_1.default();
smtpRoute.get("/", authMiddleware.requireUser, smtpController.getSMTPSettings);
smtpRoute.put("/", authMiddleware.requireUser, joiValidator.validate(smtp_schema_1.smtpUpdateValidator, "body"), smtpController.updateSMTPSettings);
exports.default = smtpRoute;
//# sourceMappingURL=smtp.routes.js.map