"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const authenticator_1 = __importDefault(require("../../middleware/authenticator"));
const joiValidator_1 = __importDefault(require("../../utils/joiValidator"));
const user_template_schema_1 = require("./user.template.schema");
const userRoute = express_1.default.Router();
const userController = new user_controller_1.default();
const authMiddleware = new authenticator_1.default();
const joiValidator = new joiValidator_1.default();
userRoute.get("/", authMiddleware.requireUser, userController.getUser);
userRoute.put("/update-profile", authMiddleware.requireUser, joiValidator.validate(user_template_schema_1.updateProfileValidator, "body"), userController.updateProfile);
userRoute.get("/reset-link/:email", userController.getForPasswordLink);
userRoute.put("/reset-password", userController.resetPassword);
userRoute.get("/dashboard", userController.getAllDashBoardDataHandler);
exports.default = userRoute;
//# sourceMappingURL=user.route.js.map