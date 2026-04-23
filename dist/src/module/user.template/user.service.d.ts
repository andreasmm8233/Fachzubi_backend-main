/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import type mongoose from "mongoose";
import { type FilterQuery } from "mongoose";
import { type User, type UserDocument } from "../../models/user";
import { type UserSessionDocument, type UserSession } from "src/models/session";
export declare class UserService {
    findById(id: string | mongoose.Schema.Types.ObjectId): Promise<(mongoose.Document<unknown, {}, UserDocument> & UserDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    findOneWithOptions(options: FilterQuery<UserDocument>): Promise<(mongoose.Document<unknown, {}, UserDocument> & UserDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    create(user: User): Promise<mongoose.Document<unknown, {}, UserDocument> & UserDocument & {
        _id: mongoose.Types.ObjectId;
    }>;
    createSession(payload: UserSession): Promise<mongoose.Document<unknown, {}, UserSessionDocument> & UserSessionDocument & {
        _id: mongoose.Types.ObjectId;
    }>;
    getUserSessionDetailsBySessionId(sessionId: string): Promise<(mongoose.Document<unknown, {}, UserSessionDocument> & UserSessionDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    getUserSessionDetails(payload: FilterQuery<UserSessionDocument>): Promise<(mongoose.Document<unknown, {}, UserSessionDocument> & UserSessionDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    updateProfile(userId: string, newPassword?: string, oldPassword?: string, profileFields?: Record<string, any>): Promise<void>;
    updateForgetPassword(userId: string, newPassword: string): Promise<(mongoose.Document<unknown, {}, UserDocument> & UserDocument & {
        _id: mongoose.Types.ObjectId;
    }) | undefined>;
}
