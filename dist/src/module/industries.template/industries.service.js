"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndustriesService = void 0;
const index_1 = require("../../models/index");
class IndustriesService {
    async getAllIndustriesService() {
        const industries = await index_1.industriesModel.find({ isDeleted: false });
        return industries;
    }
    async getAllIndustriesByFilter(searchValue, pageNo, recordPerPage) {
        const query = index_1.industriesModel.find({ isDeleted: false });
        if (searchValue) {
            void query.or([
                {
                    industryName: {
                        $regex: new RegExp(searchValue, "i"),
                    },
                },
            ]);
        }
        const docs = await index_1.industriesModel
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
    async getIndustryByIdService(id) {
        const industry = await index_1.industriesModel.findById(id);
        return industry;
    }
    async addIndustryService(industryData) {
        const newIndustry = await index_1.industriesModel.create({
            industryName: industryData,
        });
        return newIndustry;
    }
    async updateIndustryByIdService(id, industryName) {
        const updatedIndustry = await index_1.industriesModel.findByIdAndUpdate(id, {
            $set: { industryName },
        });
        return updatedIndustry;
    }
    async deleteIndustryByIdService(id) {
        const deletedIndustry = await index_1.industriesModel.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
            },
        });
        return deletedIndustry;
    }
}
exports.IndustriesService = IndustriesService;
//# sourceMappingURL=industries.service.js.map