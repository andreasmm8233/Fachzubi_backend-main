"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const objectIdConvertor_1 = __importDefault(require("../../utils/objectIdConvertor"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../models/index");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const emailService_1 = __importDefault(require("../../utils/emailService"));
class JobService {
    objectIdConverter;
    constructor() {
        this.objectIdConverter = new objectIdConvertor_1.default();
    }
    async getAllJobsService(searchValue, pageNo, filter, recordPerPage, slectedCity, industry, isFrontend, creatorFilter, letter) {
        recordPerPage = recordPerPage ?? 10;
        recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
        const filterQuery = {};
        if (industry) {
            filterQuery["industryName"] =
                this.objectIdConverter.convertToObjectId(industry);
        }
        if (slectedCity) {
            let cityIdsArray = [];
            if (typeof slectedCity === "string") {
                cityIdsArray = slectedCity.split(",").map((id) => id.trim()).filter(Boolean);
            }
            else if (Array.isArray(slectedCity)) {
                cityIdsArray = slectedCity.map((id) => String(id).trim()).filter(Boolean);
            }
            const selectedCityObjectIds = cityIdsArray
                .filter((id) => mongoose_1.default.Types.ObjectId.isValid(id))
                .map((id) => new mongoose_1.default.Types.ObjectId(id));
            const cities = await index_1.cityModel.find({ _id: { $in: selectedCityObjectIds } });
            const cityRegexes = cities.map((c) => new RegExp(`^${c.name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"));
            if (cityRegexes.length > 0) {
                const allMatchingCities = await index_1.cityModel.find({
                    name: { $in: cityRegexes }
                });
                const allMatchingCityIds = allMatchingCities.map((c) => c._id);
                filterQuery["cityInfo._id"] = {
                    $in: allMatchingCityIds,
                };
            }
            else {
                filterQuery["cityInfo._id"] = {
                    $in: selectedCityObjectIds,
                };
            }
        }
        const pipeline = [
            {
                $match: {
                    isDeleted: false,
                    ...(creatorFilter ?? {}),
                },
            },
            {
                $match: {
                    ...(isFrontend ? { status: true } : {}),
                },
            },
            {
                $lookup: {
                    from: index_1.employerModel.collection.name,
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
                                from: index_1.mediaModel.collection.name,
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
                $lookup: {
                    from: index_1.cityModel.collection.name,
                    localField: "city",
                    foreignField: "_id",
                    as: "cityInfo",
                },
            },
            {
                $lookup: {
                    from: index_1.industriesModel.collection.name,
                    localField: "industryName",
                    foreignField: "_id",
                    as: "industryInfo",
                },
            },
            {
                $lookup: {
                    from: index_1.jobTypesModel.collection.name,
                    localField: "jobType",
                    foreignField: "_id",
                    as: "jobTypeInfo",
                },
            },
            {
                $lookup: {
                    from: index_1.applicationModel.collection.name,
                    let: { jobIds: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$jobId", "$$jobIds"],
                                },
                            },
                        },
                        {
                            $count: "applicationCount",
                        },
                    ],
                    as: "count",
                },
            },
            {
                $unwind: {
                    path: "$count",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    ...filterQuery,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    jobTitle: { $first: "$jobTitle" },
                    createdAt: { $first: "$createdAt" },
                    city: { $addToSet: "$cityInfo.name" },
                    cityNames: { $first: "$cityInfo.name" },
                    industryName: {
                        $first: "$industryInfo.industryName",
                    },
                    status: { $first: "$status" },
                    company: { $first: "$company.companyName" },
                    companyLogo: { $first: "$company.companyLogo" },
                    companyId: { $first: "$company._id" },
                    startDate: { $first: "$startDate" },
                    count: { $first: "$count" },
                    jobTypeName: { $first: "$jobTypeInfo.jobTypeName" },
                },
            },
            {
                $sort: {
                    [!filter ? "createdAt" : "startDate"]: filter === "DSC" ? 1 : -1,
                },
            },
            searchValue && {
                $match: {
                    $or: [
                        { jobTitle: { $regex: new RegExp(searchValue, "i") } },
                        { cityNames: { $regex: new RegExp(searchValue, "i") } },
                        { industryName: { $regex: new RegExp(searchValue, "i") } },
                        { company: { $regex: new RegExp(searchValue, "i") } },
                    ],
                },
            },
            letter && {
                $match: {
                    jobTitle: { $regex: new RegExp(`^${letter}`, "i") },
                },
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: isFrontend ? 0 : (pageNo - 1) * recordPerPage || 0 },
                        { $limit: (isFrontend ? pageNo * recordPerPage : recordPerPage) || 10 },
                    ],
                },
            },
        ].filter(Boolean);
        const result = await index_1.jobModel.aggregate(pipeline).exec();
        const total = result[0]?.metadata[0]?.total ?? 0;
        const limit = recordPerPage || 10;
        return {
            data: result[0]?.data ?? [],
            total,
            pageNo: pageNo || 1,
            recordPerPage: limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getCount(creatorFilter) {
        const jobCount = await index_1.jobModel
            .find({ isDeleted: false, ...(creatorFilter ?? {}) })
            .count();
        return jobCount;
    }
    async getJobByIdService(id) {
        const jobId = this.objectIdConverter.convertToObjectId(id);
        const [job] = await index_1.jobModel.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$_id", jobId],
                    },
                },
            },
            {
                $lookup: {
                    from: index_1.employerModel.collection.name,
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
                                from: index_1.mediaModel.collection.name,
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
                                companyLogo: 1,
                                videoLink: 1,
                                companyDescription: 1,
                                website: 1,
                                phoneNo: 1,
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
                $lookup: {
                    from: index_1.industriesModel.collection.name,
                    let: { industryId: "$industryName" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        "$_id",
                                        {
                                            $cond: {
                                                if: { $isArray: "$$industryId" },
                                                then: "$$industryId",
                                                else: {
                                                    $cond: {
                                                        if: { $eq: ["$$industryId", null] },
                                                        then: [],
                                                        else: ["$$industryId"],
                                                    },
                                                },
                                            },
                                        },
                                    ],
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
                $lookup: {
                    from: index_1.cityModel.collection.name,
                    let: { cityId: "$city" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: [
                                        "$_id",
                                        {
                                            $cond: {
                                                if: { $isArray: "$$cityId" },
                                                then: "$$cityId",
                                                else: {
                                                    $cond: {
                                                        if: { $eq: ["$$cityId", null] },
                                                        then: [],
                                                        else: ["$$cityId"],
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                address: 1,
                                zipCode: 1,
                                directionLink: 1,
                                startTime: 1,
                                endTime: 1,
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
                    from: index_1.jobDocumentModel.collection.name,
                    let: { jobId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$job", "$$jobId"],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: index_1.mediaModel.collection.name,
                                let: { documentId: "$document" },
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
                                as: "document",
                            },
                        },
                        {
                            $unwind: {
                                path: "$document",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                job: 0,
                            },
                        },
                    ],
                    as: "attachments",
                },
            },
            {
                $lookup: {
                    from: index_1.companyImageModel.collection.name,
                    let: { jobId: "$company._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$companyId", "$$jobId"],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: index_1.mediaModel.collection.name,
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
                $lookup: {
                    from: index_1.jobImagesModel.collection.name,
                    let: { documentId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$jobId", "$$documentId"],
                                },
                            },
                        },
                    ],
                    as: "jobImage",
                },
            },
            {
                $unwind: {
                    path: "$jobImage",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: index_1.mediaModel.collection.name,
                    let: { documentId: "$jobImage.imageId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$documentId"],
                                },
                            },
                        },
                    ],
                    as: "Images",
                },
            },
            {
                $unwind: {
                    path: "$Images",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: index_1.jobTypesModel.collection.name,
                    let: { documentId: "$jobType" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: [
                                                "$_id",
                                                {
                                                    $cond: {
                                                        if: { $isArray: "$$documentId" },
                                                        then: "$$documentId",
                                                        else: {
                                                            $cond: {
                                                                if: { $eq: ["$$documentId", null] },
                                                                then: [],
                                                                else: ["$$documentId"],
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            $eq: ["$isDeleted", false],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "jobTypeDetail",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    city: {
                        $addToSet: "$city",
                    },
                    cityDetail: {
                        $addToSet: "$city",
                    },
                    jobImages: { $addToSet: "$Images" },
                    industryName: { $first: "$industryName" },
                    jobType: { $first: "$jobType" },
                    company: { $first: "$company" },
                    jobTitle: { $first: "$jobTitle" },
                    startDate: { $first: "$startDate" },
                    email: { $first: "$email" },
                    address: { $first: "$address" },
                    zipCode: { $first: "$zipCode" },
                    jobDescription: { $first: "$jobDescription" },
                    status: { $first: "$status" },
                    isDeleted: { $first: "$isDeleted" },
                    createdBy: { $first: "$createdBy" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    attachments: { $first: "$attachments" },
                    companyImages: { $addToSet: "$companyImages" },
                    videoLink: { $first: "$videoLink" },
                    jobTypeName: { $first: "$jobTypeDetail.jobTypeName" },
                },
            },
        ]);
        return job;
    }
    async updateJobByIdService(id, updatedData) {
        const updatedJob = await index_1.jobModel.findByIdAndUpdate(id, { $set: { ...updatedData } }, {
            new: true,
        });
        return updatedJob;
    }
    async deleteJobByIdService(id) {
        const deletedJob = await index_1.jobModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
        return deletedJob;
    }
    async addJobService(jobData) {
        const newJob = await index_1.jobModel.create({ ...jobData, status: true });
        return newJob;
    }
    async getSuggestionService(searchValue) {
        try {
            const suggestion = await index_1.jobModel.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        status: true,
                    },
                },
                {
                    $lookup: {
                        from: index_1.employerModel.collection.name,
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
                                $project: {
                                    _id: 1,
                                    companyName: 1,
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
                    $lookup: {
                        from: index_1.industriesModel.collection.name,
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
                        from: index_1.cityModel.collection.name,
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
                        from: index_1.jobDocumentModel.collection.name,
                        let: { jobid: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$job", "$$jobid"],
                                    },
                                },
                            },
                            {
                                $project: {
                                    job: 0,
                                },
                            },
                        ],
                        as: "attachments",
                    },
                },
                {
                    $match: {
                        $or: [
                            {
                                "industryName.industryName": {
                                    $regex: searchValue,
                                    $options: "i",
                                },
                            },
                            { "company.companyName": { $regex: searchValue, $options: "i" } },
                            { jobTitle: { $regex: searchValue, $options: "i" } },
                        ],
                    },
                },
                {
                    $project: {
                        company: "$company.companyName",
                        jobTitle: 1,
                    },
                },
            ]);
            return suggestion;
        }
        catch (error) {
            return error;
        }
    }
    async addApplicationService(payload) {
        const jobDetail = await index_1.jobModel.findById(payload.jobId);
        const adminDetail = await index_1.userModel.findOne();
        const bcc = [];
        if (jobDetail) {
            bcc.push(jobDetail.email);
        }
        if (adminDetail) {
            bcc.push(adminDetail.email);
        }
        const htmlContent = await ejs_1.default.renderFile(path_1.default.join(path_1.default.resolve(path_1.default.dirname("")), "views", "application.ejs"), {
            jobTitle: jobDetail?.jobTitle,
            payload,
        });
        await index_1.applicationModel.create(payload);
        await emailService_1.default.sendEmail({
            bcc,
            subject: `Anwendung | ${payload.applicantName}`,
            html: htmlContent,
        });
    }
    async getApplicationCount() {
        const count = await index_1.applicationModel.count();
        return count;
    }
    async getAllDeletedJobsService(searchValue, pageNo, recordPerPage, creatorFilter) {
        const pipeline = [
            {
                $match: {
                    isDeleted: true,
                    ...(creatorFilter ?? {}),
                }
            },
            {
                $lookup: {
                    from: index_1.employerModel.collection.name,
                    let: { companyId: "$company" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$companyId"] }
                            }
                        },
                        {
                            $project: {
                                companyName: 1
                            }
                        }
                    ],
                    as: "company",
                }
            },
            {
                $unwind: {
                    path: "$company",
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: index_1.cityModel.collection.name,
                    localField: "city",
                    foreignField: "_id",
                    as: "cityInfo",
                }
            },
            {
                $project: {
                    jobTitle: 1,
                    createdAt: 1,
                    company: "$company.companyName",
                    companyId: "$company._id",
                    city: "$cityInfo.name",
                    status: 1,
                }
            }
        ];
        if (searchValue) {
            pipeline.push({
                $match: {
                    $or: [
                        { jobTitle: { $regex: new RegExp(searchValue, "i") } },
                        { company: { $regex: new RegExp(searchValue, "i") } },
                        { city: { $regex: new RegExp(searchValue, "i") } },
                    ]
                }
            });
        }
        const limit = recordPerPage || 10;
        const skip = ((pageNo || 1) - 1) * limit;
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: limit }]
            }
        });
        const result = await index_1.jobModel.aggregate(pipeline).exec();
        const total = result[0]?.metadata[0]?.total ?? 0;
        return {
            data: result[0]?.data ?? [],
            total,
            pageNo: pageNo || 1,
            recordPerPage: limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getDeletedCount(creatorFilter) {
        return await index_1.jobModel.countDocuments({ isDeleted: true, ...(creatorFilter ?? {}) });
    }
    async restoreJobByIdService(id) {
        const objectId = this.objectIdConverter.convertToObjectId(id);
        return await index_1.jobModel.findByIdAndUpdate(objectId, { $set: { isDeleted: false } }, { new: true });
    }
    async hardDeleteJobByIdService(id) {
        const objectId = this.objectIdConverter.convertToObjectId(id);
        return await index_1.jobModel.findByIdAndDelete(objectId);
    }
}
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map