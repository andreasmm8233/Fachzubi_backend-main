"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manageKey_controller_1 = __importDefault(require("./manageKey.controller"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const manageKey_schema_1 = require("./manageKey.schema");
const joiValidator_1 = __importDefault(require("../../utils/joiValidator"));
const manageKeyRoute = express_1.default.Router();
const manageKeyController = new manageKey_controller_1.default();
const authMiddleware = new authenticator_1.default();
const joiValidator = new joiValidator_1.default();
manageKeyRoute.get("/", authMiddleware.requireUser, manageKeyController.getAllKeys);
manageKeyRoute.put("/", authMiddleware.requireUser, joiValidator.validate(manageKey_schema_1.editKeyValidator, "body"), manageKeyController.editKey);
exports.default = manageKeyRoute;
//# sourceMappingURL=manageKey.route.js.map