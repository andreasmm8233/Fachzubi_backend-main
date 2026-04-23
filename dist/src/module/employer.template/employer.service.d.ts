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
import { type Employer } from "src/models/employer";
import { type EmployerBodyPaylaodFrontend } from "./employer.types";
import { type Appoinment } from "src/models/appoinment";
export declare class EmployerService {
    private readonly objectIdConverter;
    constructor();
    getAllEmployersService(searchValue: any, pageNo: any, filter: any, recordPerPage: any): Promise<any>;
    getCount(): Promise<number>;
    getEmployerByIdService(id: string): Promise<{
        employerDetail: (import("mongoose").Document<unknown, {}, import("src/models/employer").EmployerDocument> & import("src/models/employer").EmployerDocument & {
            _id: import("mongoose").Types.ObjectId;
        }) | null;
        images: any;
    }>;
    updateEmployerByIdService(id: string, updatedData: Employer): Promise<(import("mongoose").Document<unknown, {}, import("src/models/employer").EmployerDocument> & import("src/models/employer").EmployerDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    deleteEmployerByIdService(id: string): Promise<(import("mongoose").Document<unknown, {}, import("src/models/employer").EmployerDocument> & import("src/models/employer").EmployerDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    addEmployerService(employerData: Employer): Promise<import("mongoose").Document<unknown, {}, import("src/models/employer").EmployerDocument> & import("src/models/employer").EmployerDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getCompanyByCity(cityId: string): Promise<(import("mongoose").Document<unknown, {}, import("src/models/employer").EmployerDocument> & import("src/models/employer").EmployerDocument & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getSuggesstionService(suggesstion: string): Promise<any[]>;
    getAllEmployersForFrontendService(paylaod: EmployerBodyPaylaodFrontend): Promise<any[]>;
    getCompanyDetailService(companyId: string): Promise<any>;
    getJobsByCompanyIdService(companyId: string, skip: number): Promise<any[]>;
    addAppoinmentService(paylaod: Appoinment): Promise<void>;
    getAppoinmentCount(): Promise<number>;
}
