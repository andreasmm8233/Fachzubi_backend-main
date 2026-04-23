"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobTypesService = void 0;
const index_1 = require("../../models/index");
const objectIdConvertor_1 = __importDefault(require("../../utils/objectIdConvertor"));
class JobTypesService {
    objectIdConverter;
    constructor() {
        this.objectIdConverter = new objectIdConvertor_1.default();
    }
    async getAllJobTypesService() {
        const jobTypes = await index_1.jobTypesModel.find({ isDeleted: false });
        return jobTypes;
    }
    async findByName(jobTypeName) {
        const jobTypes = await index_1.jobTypesModel.findOne({
            jobTypeName: { $regex: new RegExp(`^${jobTypeName}$`, "i") },
            isDeleted: false,
        });
        return jobTypes;
    }
    async getAllJobTypesByFilter(searchValue, pageNo, recordPerPage) {
        const query = index_1.jobTypesModel.find({ isDeleted: false });
        if (searchValue) {
            void query.or([
                {
                    jobTypeName: {
                        $regex: new RegExp(searchValue, "i"),
                    },
                },
            ]);
        }
        const docs = await index_1.jobTypesModel
            .find({
            isDeleted: false,
        })
            .count();
        const limit = parseInt(recordPerPage || "0");
        const skip = (pageNo - 1) * limit;
        const result = await query
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .exec();
        return {
            count: Math.ceil(docs / Number(recordPerPage || 10)),
            data: result,
        };
    }
    async getJobTypeByIdService(id) {
        const objectId = this.objectIdConverter.convertToObjectId(id);
        const jobType = await index_1.jobTypesModel.findById(objectId);
        return jobType;
    }
    async addJobTypeService(jobTypeData) {
        const newJobType = await index_1.jobTypesModel.create({
            jobTypeName: jobTypeData.jobTypeName,
        });
        return newJobType;
    }
    async updateJobTypeByIdService(id, jobTypeName) {
        const objectId = this.objectIdConverter.convertToObjectId(id);
        const updatedJobType = await index_1.jobTypesModel.findByIdAndUpdate(objectId, {
            $set: { jobTypeName: jobTypeName.jobTypeName },
        });
        return updatedJobType;
    }
    async deleteJobTypeByIdService(id) {
        const objectId = this.objectIdConverter.convertToObjectId(id);
        const deletedJobType = await index_1.jobTypesModel.findByIdAndUpdate(objectId, {
            $set: {
                isDeleted: true,
            },
        });
        return deletedJobType;
    }
}
exports.JobTypesService = JobTypesService;
//# sourceMappingURL=job.types.service.js.map