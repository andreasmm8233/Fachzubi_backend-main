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
import { type Schema, Types } from "mongoose";
import { type CityDocument } from "../../models/city";
export declare class CityService {
    private buildQrCode;
    private formatQrTargetUrl;
    getAllCitiesService(creatorFilter?: {
        createdBy: any;
        createdByModel: string;
    }): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: Types.ObjectId;
    })[]>;
    getAllCitiesByFilter(payload: any): Promise<{
        count: number;
        result: any[];
    }>;
    getCityByIdService(id: string): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: Types.ObjectId;
    }) | null>;
    addCityService(data: CityDocument): Promise<import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: Types.ObjectId;
    }>;
    updateCityByIdService(id: string, updatedData: Schema<CityDocument>): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: Types.ObjectId;
    }) | null>;
    deleteCityByIdService(id: string): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: Types.ObjectId;
    }) | null>;
    getAllDeletedCitiesService(payload: {
        searchValue?: string;
        pageNo?: string | number;
        recordPerPage?: string | number;
        creatorFilter?: {
            createdBy: any;
            createdByModel: string;
        };
    }): Promise<{
        data: any[];
        total: number;
        pageNo: number;
        recordPerPage: number;
        totalPages: number;
    }>;
    restoreCityByIdService(id: string): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: Types.ObjectId;
    }) | null>;
    hardDeleteCityByIdService(id: string): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: Types.ObjectId;
    }) | null>;
    getAllCitiesFrontendService(): Promise<(import("mongoose").Document<unknown, {}, CityDocument> & CityDocument & {
        _id: Types.ObjectId;
    })[]>;
}
