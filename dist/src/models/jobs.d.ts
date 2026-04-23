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
import { Schema, type Document } from "mongoose";
export interface Job {
    city: Schema.Types.ObjectId;
    company: Schema.Types.ObjectId;
    jobTitle: string;
    startDate: Date;
    email: string;
    additionalEmail?: string;
    address: string;
    zipCode: string;
    jobDescription: string;
    status: boolean;
    createdBy: Schema.Types.ObjectId;
    isDeleted: boolean;
    industryName: Schema.Types.ObjectId;
    videoLink: string[];
    jobType: Schema.Types.ObjectId;
}
export interface JobDocument extends Job, Document {
    createdAt: Date;
    updatedAt: Date;
}
declare const _JobModel: import("mongoose").Model<JobDocument, {}, {}, {}, Document<unknown, {}, JobDocument> & JobDocument & {
    _id: import("mongoose").Types.ObjectId;
}, any>;
export default _JobModel;
