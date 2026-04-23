"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const industries_controller_1 = __importDefault(require("./industries.controller"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const industriesRoute = express_1.default.Router();
const industriesController = new industries_controller_1.default();
const authMiddleware = new authenticator_1.default();
industriesRoute.get("/", authMiddleware.requireUser, industriesController.getAllIndustries);
industriesRoute.get("/get_all_Industry", industriesController.getAllIndustry);
industriesRoute.get("/:id", authMiddleware.requireUser, industriesController.getIndustryById);
industriesRoute.post("/", authMiddleware.requireUser, industriesController.addIndustry);
industriesRoute.put("/", authMiddleware.requireUser, industriesController.updateIndustryById);
industriesRoute.delete("/:id", authMiddleware.requireUser, industriesController.deleteIndustryById);
exports.default = industriesRoute;
//# sourceMappingURL=industries.routes.js.map