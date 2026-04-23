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
import mongoose, { Schema, type Document } from "mongoose";
export interface Employer {
    industryName?: Schema.Types.ObjectId;
    contactPerson?: string;
    jobTitle?: string;
    companyName?: string;
    email?: string;
    website?: string;
    phoneNo?: string;
    address?: string;
    zipCode?: string;
    companyLogo?: mongoose.Schema.Types.ObjectId;
    companyDescription?: string;
    videoLink?: string[];
    city?: mongoose.Schema.Types.ObjectId;
    status?: boolean;
    isDeleted?: boolean;
    createdBy?: Schema.Types.ObjectId;
}
export interface EmployerDocument extends Employer, Document {
    createdAt: Date;
    updatedAt: Date;
    companyImage?: any;
}
declare const _EmployerModel: mongoose.Model<EmployerDocument, {}, {}, {}, mongoose.Document<unknown, {}, EmployerDocument> & EmployerDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _EmployerModel;
