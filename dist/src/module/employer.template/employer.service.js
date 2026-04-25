"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerService = void 0;
const objectIdConvertor_1 = __importDefault(require("../../utils/objectIdConvertor"));
const models_1 = require("../../models");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const emailService_1 = __importDefault(require("../../utils/emailService"));
class EmployerService {
    objectIdConverter;
    constructor() {
        this.objectIdConverter = new objectIdConvertor_1.default();
    }
    async getAllEmployersService(searchValue, pageNo, filter, recordPerPage) {
        const pipeline = [];
        pipeline.push({
            $match: {
                isDeleted: false,
            },
        });
        pipeline.push({
            $lookup: {
                from: models_1.industriesModel.collection.name,
                localField: "industryName",
                foreignField: "_id",
                as: "industryName",
            },
        });
        pipeline.push({
            $lookup: {
                from: models_1.cityModel.collection.name,
                localField: "city",
                foreignField: "_id",
                as: "city",
            },
        });
        pipeline.push({
            $unwind: {
                path: "$industryName",
                preserveNullAndEmptyArrays: true,
            },
        });
        pipeline.push({
            $unwind: {
                path: "$city",
                preserveNullAndEmptyArrays: true,
            },
        });
        pipeline.push({
            $project: {
                _id: 1,
                email: 1,
                companyName: 1,
                contactPerson: 1,
                createdAt: 1,
                industryName: "$industryName.industryName",
                status: 1,
                city: "$city.name",
            },
        });
        if (filter) {
            const newFilter = filter === "Date" ? "createdAt" : filter;
            pipeline.push({
                $sort: {
                    [newFilter]: 1,
                },
            });
        }
        else {
            pipeline.push({
                $sort: {
                    createdAt: -1,
                },
            });
        }
        if (searchValue) {
            pipeline.push({
                $match: {
                    $or: [
                        { email: { $regex: new RegExp(searchValue, "i") } },
                        { companyName: { $regex: new RegExp(searchValue, "i") } },
                        { contactPerson: { $regex: new RegExp(searchValue, "i") } },
                        { industryName: { $regex: new RegExp(searchValue, "i") } },
                        { city: { $regex: new RegExp(searchValue, "i") } },
                    ],
                },
            });
        }
        const skip = Number(pageNo - 1) * recordPerPage;
        const limit = Number(recordPerPage);
        pipeline.push({
            $facet: {
                metadata: [
                    { $count: "total" },
                    { $addFields: { pageNo, recordPerPage } },
                ],
                data: [{ $skip: skip }, { $limit: limit }],
            },
        });
        const result = await models_1.employerModel.aggregate(pipeline).exec();
        return result[0] ? result[0].data : [];
    }
    async getCount() {
        const employer = await models_1.employerModel
            .find({
            isDeleted: false,
        })
            .count();
        return employer;
    }
    async getEmployerByIdService(id) {
        const objectId = this.objectIdConverter.convertToObjectId(id);
        let images;
        const employerDetail = await models_1.employerModel
            .findById(id)
            .populate("industryName", "industryName")
            .populate("city", "name")
            .populate({
            path: "companyLogo",
            select: "_id",
        })
            .select("-industryName -city");
        if (employerDetail) {
            images = await models_1.companyImageModel.aggregate([
                {
                    $match: {
                        companyId: objectId,
                    },
                },
                {
                    $lookup: {
                        from: models_1.mediaModel.collection.name,
                        let: { mediaId: "$imageId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$mediaId"],
                                    },
                                },
                            },
                        ],
                        as: "mediaDetail",
                    },
                },
                {
                    $unwind: {
                        path: "$mediaDetail",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        path: "$mediaDetail.filepath",
                        imageId: "$mediaDetail._id",
                    },
                },
            ]);
        }
        return { employerDetail, images };
    }
    async updateEmployerByIdService(id, updatedData) {
        const updatedEmployer = await models_1.employerModel.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        return updatedEmployer;
    }
    async deleteEmployerByIdService(id) {
        const deletedEmployer = await models_1.employerModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
        return deletedEmployer;
    }
    async addEmployerService(employerData) {
        const newEmployer = await models_1.employerModel.create({
            ...employerData,
            status: true,
        });
        return newEmployer;
    }
    async getCompanyByCity(cityId) {
        const cityIdsArray = cityId.split(",");
        const objectIdCityIds = cityIdsArray.map((id) => this.objectIdConverter.convertToObjectId(id));
        const employers = await models_1.employerModel
            .find({
            city: { $in: objectIdCityIds.length ? objectIdCityIds : cityId },
            isDeleted: false,
        })
            .select("companyName");
        return employers;
    }
    async getSuggesstionService(suggesstion) {
        suggesstion = suggesstion ?? "";
        const suggestionList = await models_1.employerModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    status: true,
                },
            },
            {
                $lookup: {
                    from: models_1.industriesModel.collection.name,
                    localField: "industryName",
                    foreignField: "_id",
                    as: "industryName",
                },
            },
            {
                $unwind: {
                    path: "$industryName",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    companyName: 1,
                    industryName: "$industryName.industryName",
                },
            },
            {
                $match: {
                    $or: [
                        { companyName: { $regex: suggesstion, $options: "i" } },
                        { industryName: { $regex: suggesstion, $options: "i" } },
                    ],
                },
            },
            {
                $limit: 10,
            },
        ]);
        return suggestionList;
    }
    async getAllEmployersForFrontendService(paylaod) {
        const filterQuery = {};
        const skip = paylaod.skip ?? 0;
        if (paylaod.slectedCity) {
            if (typeof paylaod.slectedCity === "string") {
                paylaod.slectedCity = [paylaod.slectedCity];
            }
            filterQuery["city"] = {
                $in: paylaod.slectedCity.map((data) => this.objectIdConverter.convertToObjectId(data)),
            };
        }
        if (paylaod.isFillter) {
            filterQuery["industryName._id"] =
                this.objectIdConverter.convertToObjectId(paylaod.isFillter);
        }
        if (paylaod.searchValue) {
            filterQuery["$or"] = [
                { companyName: { $regex: paylaod.searchValue, $options: "i" } },
                { companyDescription: { $regex: paylaod.searchValue, $options: "i" } },
                {
                    "industryName.industryName": {
                        $regex: paylaod.searchValue,
                        $options: "i",
                    },
                },
            ];
        }
        const EmpList = await models_1.employerModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    status: true,
                },
            },
            {
                $lookup: {
                    from: models_1.industriesModel.collection.name,
                    let: { industryId: "$industryName" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$industryId"],
                                },
                            },
                        },
                        {
                            $project: {
                                industryName: 1,
                            },
                        },
                    ],
                    as: "industryName",
                },
            },
            {
                $unwind: {
                    path: "$industryName",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: models_1.mediaModel.collection.name,
                    let: { logoId: "$companyLogo" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$logoId"],
                                },
                            },
                        },
                        {
                            $project: {
                                filepath: 1,
                            },
                        },
                    ],
                    as: "companyLogo",
                },
            },
            {
                $unwind: {
                    path: "$companyLogo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    ...filterQuery,
                },
            },
            {
                $skip: Number(skip),
            },
            {
                $limit: 10,
            },
            {
                $project: {
                    industryName: "$industryName.industryName",
                    companyName: 1,
                    companyLogo: "$companyLogo.filepath",
                },
            },
        ]);
        return EmpList;
    }
    async getCompanyDetailService(companyId) {
        const [companyDetail] = await models_1.employerModel.aggregate([
            {
                $match: {
                    _id: this.objectIdConverter.convertToObjectId(companyId),
                },
            },
            {
                $lookup: {
                    from: models_1.mediaModel.collection.name,
                    let: { logoId: "$companyLogo" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$logoId"],
                                },
                            },
                        },
                        {
                            $project: {
                                filepath: 1,
                            },
                        },
                    ],
                    as: "companyLogo",
                },
            },
            {
                $unwind: {
                    path: "$companyLogo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: models_1.industriesModel.collection.name,
                    let: { industryId: "$industryName" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$industryId"],
                                },
                            },
                        },
                        {
                            $project: {
                                industryName: 1,
                            },
                        },
                    ],
                    as: "industryName",
                },
            },
            {
                $unwind: {
                    path: "$industryName",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: models_1.cityModel.collection.name,
                    let: { cityId: "$city" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$cityId"],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                address: 1,
                            },
                        },
                    ],
                    as: "city",
                },
            },
            {
                $unwind: {
                    path: "$city",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: models_1.companyImageModel.collection.name,
                    let: { jobid: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$companyId", "$$jobid"],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: models_1.mediaModel.collection.name,
                                let: { documentId: "$imageId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$documentId"] },
                                        },
                                    },
                                    {
                                        $project: {
                                            createdAt: 0,
                                            updatedAt: 0,
                                            __v: 0,
                                        },
                                    },
                                ],
                                as: "companyImages",
                            },
                        },
                        {
                            $unwind: {
                                path: "$companyImages",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                companyImages: 1,
                            },
                        },
                    ],
                    as: "companyImages",
                },
            },
            {
                $project: {
                    email: 1,
                    companyName: 1,
                    address: 1,
                    zipCode: 1,
                    industryName: "$industryName.industryName",
                    contactPerson: 1,
                    companyLogo: "$companyLogo.filepath",
                    companyDescription: 1,
                    videoLink: 1,
                    website: 1,
                    phoneNo: 1,
                    companyImages: {
                        $map: {
                            input: "$companyImages",
                            as: "image",
                            in: "$$image.companyImages.filepath",
                        },
                    },
                },
            },
        ]);
        return companyDetail;
    }
    async getJobsByCompanyIdService(companyId, skip) {
        const companyList = await models_1.jobModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$company",
                            this.objectIdConverter.convertToObjectId(companyId),
                        ],
                    },
                },
            },
            {
                $match: {
                    isDeleted: false,
                    status: true,
                },
            },
            {
                $lookup: {
                    from: models_1.industriesModel.collection.name,
                    let: { industryId: "$industryName" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$industryId"],
                                },
                            },
                        },
                        {
                            $project: {
                                industryName: 1,
                                _id: 1,
                            },
                        },
                    ],
                    as: "industryName",
                },
            },
            {
                $unwind: {
                    path: "$industryName",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: models_1.cityModel.collection.name,
                    let: { cityId: "$city" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$cityId"],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                            },
                        },
                    ],
                    as: "city",
                },
            },
            {
                $unwind: {
                    path: "$city",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: models_1.employerModel.collection.name,
                    let: { companyId: "$company" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$companyId"],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: models_1.mediaModel.collection.name,
                                let: { logoId: "$companyLogo" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$logoId"],
                                            },
                                        },
                                    },
                                ],
                                as: "companyLogo",
                            },
                        },
                        {
                            $unwind: {
                                path: "$companyLogo",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                companyName: 1,
                                companyLogo: "$companyLogo.filepath",
                                companyId: "$_id",
                            },
                        },
                    ],
                    as: "company",
                },
            },
            {
                $unwind: {
                    path: "$company",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $skip: Number(skip),
            },
            {
                $limit: 10,
            },
            {
                $group: {
                    _id: "$_id",
                    jobTitle: { $first: "$jobTitle" },
                    startDate: { $first: "$startDate" },
                    status: { $first: "$status" },
                    createdAt: { $first: "$createdAt" },
                    city: { $addToSet: "$city.name" },
                    industryName: { $first: "$industryName.industryName" },
                    company: { $first: "$company.companyName" },
                    companyLogo: { $first: "$company.companyLogo" },
                    companyId: { $first: "$company.companyId" },
                },
            },
        ]);
        return companyList;
    }
    async addAppoinmentService(paylaod) {
        const employerDetail = await models_1.employerModel.findById(paylaod.companyId);
        const adminDetail = await models_1.userModel.findOne();
        const bcc = [];
        if (employerDetail?.email) {
            bcc.push(employerDetail.email);
        }
        if (adminDetail) {
            bcc.push(adminDetail.email);
        }
        const htmlContent = await ejs_1.default.renderFile(path_1.default.join(path_1.default.resolve(path_1.default.dirname("")), "views", "appoinment.ejs"), {
            jobTitle: employerDetail?.jobTitle,
            payload: paylaod,
        });
        await models_1.appoinmentModel.create(paylaod);
        await emailService_1.default.sendEmail({
            bcc: bcc,
            subject: `Termin | ${paylaod.applicantName}`,
            html: htmlContent,
        });
    }
    async getAppoinmentCount() {
        const count = await models_1.appoinmentModel.count();
        return count;
    }
}
exports.EmployerService = EmployerService;
//# sourceMappingURL=employer.service.js.map