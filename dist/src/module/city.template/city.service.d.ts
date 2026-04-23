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
import { type Schema } from "mongoose";
import { type CityDocument } from "../../models/city";
export declare class CityService {
    getAllCitiesService(): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getAllCitiesByFilter(payload: any): Promise<{
        count: number;
        result: (import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
            _id: import("mongoose").Types.ObjectId;
        })[];
    }>;
    getCityByIdService(id: string): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    addCityService(data: CityDocument): Promise<import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateCityByIdService(id: string, updatedData: Schema<CityDocument>): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    deleteCityByIdService(id: string): Promise<import("mongoose").ModifyResult<import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getAllCitiesFrontendService(): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
