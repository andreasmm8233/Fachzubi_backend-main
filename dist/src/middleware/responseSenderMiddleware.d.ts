import { type Response } from "express";
export interface ResponseType {
    status: number;
    message: string;
    data: any | null;
}
declare class ResponseSenderMiddleware {
    private readonly res;
    constructor(res: Response);
    private sendResponse;
    sendSuccess200Response(message: string, data?: any | null): void;
    sendCreated201Response(message: string, data?: any | null): void;
    sendNoContent204Response(): void;
    sendNotFound404Response(message?: string, data?: any | null): void;
    sendForbidden403Response(message?: string, data?: any | null): void;
    sendUnauthorized401Response(message?: string, data?: any | null): void;
    sendBadRequest400Response(message?: string, data?: any | null): void;
    sendErrorResponse(message: string, data?: any | null): void;
    sendCustomSuccessResponse(status: number, message: string, data?: any | null): void;
    sendCustomErrorResponse(status: number, message: string, data?: any | null): void;
}
export default ResponseSenderMiddleware;
