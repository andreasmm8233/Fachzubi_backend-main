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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { type JobTypes } from "src/models/jobType";
export declare class JobTypesService {
    private readonly objectIdConverter;
    constructor();
    getAllJobTypesService(): Promise<(import("mongoose").Document<unknown, {}, import("src/models/jobType").JobTypesDocument> & import("src/models/jobType").JobTypesDocument & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findByName(jobTypeName: any): Promise<(import("mongoose").Document<unknown, {}, import("src/models/jobType").JobTypesDocument> & import("src/models/jobType").JobTypesDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getAllJobTypesByFilter(searchValue: any, pageNo: any, recordPerPage: any): Promise<{
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("src/models/jobType").JobTypesDocument> & import("src/models/jobType").JobTypesDocument & {
            _id: import("mongoose").Types.ObjectId;
        })[];
    }>;
    getJobTypeByIdService(id: string): Promise<(import("mongoose").Document<unknown, {}, import("src/models/jobType").JobTypesDocument> & import("src/models/jobType").JobTypesDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    addJobTypeService(jobTypeData: JobTypes): Promise<import("mongoose").Document<unknown, {}, import("src/models/jobType").JobTypesDocument> & import("src/models/jobType").JobTypesDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateJobTypeByIdService(id: string, jobTypeName: JobTypes): Promise<(import("mongoose").Document<unknown, {}, import("src/models/jobType").JobTypesDocument> & import("src/models/jobType").JobTypesDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    deleteJobTypeByIdService(id: string): Promise<(import("mongoose").Document<unknown, {}, import("src/models/jobType").JobTypesDocument> & import("src/models/jobType").JobTypesDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
