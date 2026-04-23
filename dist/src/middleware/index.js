"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseSenderMiddleware_1 = __importDefault(require("./responseSenderMiddleware"));
const authenticator_1 = __importDefault(require("./authenticator"));
const setupGlobalCustomMiddleware = (app) => {
    const auth = new authenticator_1.default();
    app.use((_req, res, next) => {
        const responseSenderMiddleware = new responseSenderMiddleware_1.default(res);
        res.sendSuccess200Response =
            responseSenderMiddleware.sendSuccess200Response.bind(responseSenderMiddleware);
        res.sendCreated201Response =
            responseSenderMiddleware.sendCreated201Response.bind(responseSenderMiddleware);
        res.sendNoContent204Response =
            responseSenderMiddleware.sendNoContent204Response.bind(responseSenderMiddleware);
        res.sendNotFound404Response =
            responseSenderMiddleware.sendNotFound404Response.bind(responseSenderMiddleware);
        res.sendForbidden403Response =
            responseSenderMiddleware.sendForbidden403Response.bind(responseSenderMiddleware);
        res.sendUnauthorized401Response =
            responseSenderMiddleware.sendUnauthorized401Response.bind(responseSenderMiddleware);
        res.sendBadRequest400Response =
            responseSenderMiddleware.sendBadRequest400Response.bind(responseSenderMiddleware);
        res.sendErrorResponse = responseSenderMiddleware.sendErrorResponse.bind(responseSenderMiddleware);
        res.sendCustomSuccessResponse =
            responseSenderMiddleware.sendCustomSuccessResponse.bind(responseSenderMiddleware);
        res.sendCustomErrorResponse =
            responseSenderMiddleware.sendCustomErrorResponse.bind(responseSenderMiddleware);
        next();
    });
    app.use(auth.verifyToken);
};
exports.default = setupGlobalCustomMiddleware;
//# sourceMappingURL=index.js.map