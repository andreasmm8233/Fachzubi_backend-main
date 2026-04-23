"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const objectIdConvertor_1 = __importDefault(require("../../utils/objectIdConvertor"));
const index_1 = require("../../models/index");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const emailService_1 = __importDefault(require("../../utils/emailService"));
class JobService {
    objectIdConverter;
    constructor() {
        this.objectIdConverter = new objectIdConvertor_1.default();
    }
    async getAllJobsService(searchValue, pageNo, filter, recordPerPage, slectedCity, industry, isFrontend) {
        recordPerPage = recordPerPage ?? 10;
        recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
        const filterQuery = {};
        if (industry) {
            filterQuery["industryName"] =
                this.objectIdConverter.convertToObjectId(industry);
        }
        if (slectedCity) {
            if (typeof slectedCity === "string") {
                slectedCity = [slectedCity];
            }
            filterQuery["cityInfo._id"] = {
                $in: slectedCity.map((data) => this.objectIdConverter.convertToObjectId(data)),
            };
        }
        const pipeline = [
            {
                $match: { isDeleted: false },
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
                    industryName: {
                        $first: { $arrayElemAt: ["$industryInfo.industryName", 0] },
                    },
                    status: { $first: "$status" },
                    company: { $first: "$company.companyName" },
                    companyLogo: { $first: "$company.companyLogo" },
                    companyId: { $first: "$company._id" },
                    startDate: { $first: "$startDate" },
                    count: { $first: "$count" },
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
                        { city: { $regex: new RegExp(searchValue, "i") } },
                        { industryName: { $regex: new RegExp(searchValue, "i") } },
                        { company: { $regex: new RegExp(searchValue, "i") } },
                    ],
                },
            },
            {
                $skip: isFrontend ? 0 : (pageNo - 1) * recordPerPage || 0,
            },
            {
                $limit: isFrontend ? pageNo * recordPerPage : recordPerPage || 0,
            },
        ].filter(Boolean);
        try {
            const result = await index_1.jobModel.aggregate(pipeline).exec();
            return result;
        }
        catch (error) {
            return error;
        }
    }
    async getCount() {
        const jobCount = await index_1.jobModel.find().count({
            isDeleted: false,
        });
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
                                    $in: ["$_id", "$$cityId"],
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
                                            $eq: ["$_id", "$$documentId"],
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
                $unwind: {
                    path: "$jobTypeDetail",
                    preserveNullAndEmptyArrays: true,
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
}
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map