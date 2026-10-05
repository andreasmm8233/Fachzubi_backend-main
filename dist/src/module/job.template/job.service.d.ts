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
import mongoose from "mongoose";
import { type Job } from "../../models/jobs";
import { type Application } from "../../models/jobApplication";
export declare class JobService {
    private readonly objectIdConverter;
    constructor();
    getAllJobsService(searchValue: string, pageNo: number, filter: string, recordPerPage: number, slectedCity: any, industry: string, isFrontend: string, creatorFilter?: {
        createdBy: any;
        createdByModel: string;
    }, letter?: string): Promise<{
        data: any;
        total: any;
        pageNo: number;
        recordPerPage: number;
        totalPages: number;
    }>;
    getCount(creatorFilter?: {
        createdBy: any;
        createdByModel: string;
    }): Promise<number>;
    getJobByIdService(id: string): Promise<any>;
    updateJobByIdService(id: string, updatedData: Job): Promise<(mongoose.Document<unknown, {}, import("../../models/jobs").JobDocument> & import("../../models/jobs").JobDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    deleteJobByIdService(id: string): Promise<(mongoose.Document<unknown, {}, import("../../models/jobs").JobDocument> & import("../../models/jobs").JobDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    addJobService(jobData: Job): Promise<mongoose.Document<unknown, {}, import("../../models/jobs").JobDocument> & import("../../models/jobs").JobDocument & {
        _id: mongoose.Types.ObjectId;
    }>;
    getSuggestionService(searchValue: string): Promise<any>;
    addApplicationService(payload: Application): Promise<void>;
    getApplicationCount(): Promise<number>;
    getAllDeletedJobsService(searchValue: string, pageNo: number, recordPerPage: number, creatorFilter?: {
        createdBy: any;
        createdByModel: string;
    }): Promise<{
        data: any;
        total: any;
        pageNo: number;
        recordPerPage: number;
        totalPages: number;
    }>;
    getDeletedCount(creatorFilter?: {
        createdBy: any;
        createdByModel: string;
    }): Promise<number>;
    restoreJobByIdService(id: string): Promise<(mongoose.Document<unknown, {}, import("../../models/jobs").JobDocument> & import("../../models/jobs").JobDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
    hardDeleteJobByIdService(id: string): Promise<(mongoose.Document<unknown, {}, import("../../models/jobs").JobDocument> & import("../../models/jobs").JobDocument & {
        _id: mongoose.Types.ObjectId;
    }) | null>;
}
