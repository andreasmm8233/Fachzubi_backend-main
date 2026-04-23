"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
class ResponseSenderMiddleware {
    res;
    constructor(res) {
        this.res = res;
    }
    sendResponse(status, message, data = null) {
        const response = {
            status,
            message,
            data,
        };
        this.res.status(status).json(response);
    }
    sendSuccess200Response(message, data = null) {
        logger_1.default.info({ url: this.res.req.url, status: 200, message, data });
        this.sendResponse(200, message, data);
    }
    sendCreated201Response(message, data = null) {
        logger_1.default.info({ url: this.res.req.url, status: 201, message, data });
        this.sendResponse(201, message, data);
    }
    sendNoContent204Response() {
        logger_1.default.info({ url: this.res.req.url, status: 204 });
        this.res.status(204).end();
    }
    sendNotFound404Response(message = "Not Found", data = null) {
        logger_1.default.error({ url: this.res.req.url, status: 404, message, data });
        this.sendResponse(404, message, data);
    }
    sendForbidden403Response(message = "Forbidden", data = null) {
        logger_1.default.error({ url: this.res.req.url, status: 403, message, data });
        this.sendResponse(403, message, data);
    }
    sendUnauthorized401Response(message = "Unauthorized", data = null) {
        logger_1.default.error({ url: this.res.req.url, status: 401, message, data });
        this.sendResponse(401, message, data);
    }
    sendBadRequest400Response(message = "Bad Request", data = null) {
        logger_1.default.error({ url: this.res.req.url, status: 400, message, data });
        this.sendResponse(400, message, data);
    }
    sendErrorResponse(message, data = null) {
        logger_1.default.error({ url: this.res.req.url, status: 500, message, data });
        this.sendResponse(500, message, data);
    }
    sendCustomSuccessResponse(status, message, data = null) {
        logger_1.default.info({ url: this.res.req.url, status, message, data });
        this.sendResponse(status, message, data);
    }
    sendCustomErrorResponse(status, message, data = null) {
        logger_1.default.error({ url: this.res.req.url, status, message, data });
        this.sendResponse(status, message, data);
    }
}
exports.default = ResponseSenderMiddleware;
//# sourceMappingURL=responseSenderMiddleware.js.map