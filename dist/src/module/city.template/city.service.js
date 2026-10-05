"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
const mongoose_1 = require("mongoose");
const index_1 = require("../../models/index");
const logger_1 = __importDefault(require("../../utils/logger"));
class CityService {
    buildQrCode(qrTargetUrl) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrTargetUrl)}`;
    }
    formatQrTargetUrl(url, id) {
        const match = url.match(/\/+jobs\/+/);
        if (!match)
            return url;
        const matchedStr = match[0];
        const jobsIndex = url.indexOf(matchedStr);
        const urlBeforeJobs = url.substring(0, jobsIndex);
        const base = `${urlBeforeJobs}/jobs/`;
        const rest = url.substring(jobsIndex + matchedStr.length);
        const parts = rest.split("/").filter(Boolean);
        if (parts.length === 0) {
            return base;
        }
        if (parts[0] === id) {
            return `${base}${encodeURIComponent(id)}/${parts.slice(1).join("/")}`;
        }
        return `${base}${encodeURIComponent(id)}/${parts.join("/")}`;
    }
    async getAllCitiesService(creatorFilter) {
        const cities = await index_1.cityModel.find({
            isDeleted: { $ne: true },
            ...(creatorFilter ?? {}),
        });
        return cities;
    }
    async getAllCitiesByFilter(payload) {
        const { searchValue, pageNo, recordPerPage, creatorFilter } = payload;
        const filter = {
            isDeleted: false,
            ...(creatorFilter ?? {}),
        };
        if (searchValue) {
            filter.name = { $regex: new RegExp(searchValue, "i") };
        }
        const limit = parseInt(recordPerPage || "10");
        const skip = ((parseInt(pageNo) || 1) - 1) * limit;
        const [docs, cities] = await Promise.all([
            index_1.cityModel.countDocuments(filter),
            index_1.cityModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: "createdBy", select: "username first_name last_name email" })
                .lean()
                .exec(),
        ]);
        const result = cities.map((city) => {
            let creatorName = null;
            let creatorEmail = null;
            if (city.createdBy) {
                creatorEmail = city.createdBy.email ?? null;
                creatorName =
                    city.createdByModel === "Employee"
                        ? `${city.createdBy.first_name ?? ""} ${city.createdBy.last_name ?? ""}`.trim()
                        : (city.createdBy.username ?? null);
            }
            return { ...city, creatorName, creatorEmail };
        });
        return {
            count: Math.ceil(docs / limit),
            result,
        };
    }
    async getCityByIdService(id) {
        const city = await index_1.cityModel.findById(id);
        return city;
    }
    async addCityService(data) {
        const { name, startTime, endTime, address, zipCode, directionLink } = data;
        const extra = data;
        const newCity = await index_1.cityModel.create({
            name,
            startTime,
            endTime,
            address,
            zipCode,
            directionLink,
            createdBy: extra.createdBy,
            createdByModel: extra.createdByModel,
        });
        if (extra.qrTargetUrl) {
            newCity.qrTargetUrl = this.formatQrTargetUrl(extra.qrTargetUrl, newCity._id.toString());
            newCity.qrCode = this.buildQrCode(newCity.qrTargetUrl);
        }
        await newCity.save();
        if (extra.duplicateFromCityId) {
            logger_1.default.info(`[DuplicateCity] Starting job cloning from source city ID ${extra.duplicateFromCityId}`);
            try {
                const originalCityObjectId = new mongoose_1.Types.ObjectId(extra.duplicateFromCityId);
                let originalJobs = await index_1.jobModel.find({
                    $or: [
                        { city: originalCityObjectId },
                        { city: extra.duplicateFromCityId.toString() }
                    ],
                    isDeleted: { $ne: true },
                });
                if (originalJobs.length === 0) {
                    const allActiveJobs = await index_1.jobModel.find({ isDeleted: { $ne: true } });
                    originalJobs = allActiveJobs.filter((job) => {
                        const cities = job.city || [];
                        return cities.some((cId) => cId.toString() === extra.duplicateFromCityId.toString());
                    });
                }
                logger_1.default.info(`[DuplicateCity] Found ${originalJobs.length} jobs to clone from city ID ${extra.duplicateFromCityId}`);
                const employerClonesMap = new Map();
                for (const job of originalJobs) {
                    const clonedJob = job.toObject();
                    delete clonedJob._id;
                    delete clonedJob.id;
                    delete clonedJob.createdAt;
                    delete clonedJob.updatedAt;
                    clonedJob.city = (clonedJob.city || []).map((cId) => cId.toString() === extra.duplicateFromCityId.toString() ? newCity._id : cId);
                    const originalEmployerId = job.company ? job.company.toString() : null;
                    let clonedEmployerId = originalEmployerId ? employerClonesMap.get(originalEmployerId) : undefined;
                    if (originalEmployerId && !clonedEmployerId) {
                        const originalEmployer = await index_1.employerModel.findOne({ _id: job.company, isDeleted: { $ne: true } });
                        if (originalEmployer) {
                            const clonedEmployerData = originalEmployer.toObject();
                            delete clonedEmployerData._id;
                            delete clonedEmployerData.id;
                            delete clonedEmployerData.createdAt;
                            delete clonedEmployerData.updatedAt;
                            clonedEmployerData.city = newCity._id;
                            clonedEmployerData.isDeleted = false;
                            const newEmployer = await index_1.employerModel.create(clonedEmployerData);
                            clonedEmployerId = newEmployer._id;
                            employerClonesMap.set(originalEmployerId, newEmployer._id);
                            logger_1.default.info(`[DuplicateCity] Cloned employer ${originalEmployer.companyName} to new city ${newCity.name} (New Employer ID: ${newEmployer._id})`);
                        }
                    }
                    if (clonedEmployerId) {
                        clonedJob.company = clonedEmployerId;
                    }
                    await index_1.jobModel.create(clonedJob);
                }
            }
            catch (err) {
                logger_1.default.error("[DuplicateCity] Error cloning jobs:", err);
            }
        }
        return newCity;
    }
    async updateCityByIdService(id, updatedData) {
        const payload = { ...updatedData };
        if (payload.qrTargetUrl) {
            payload.qrTargetUrl = this.formatQrTargetUrl(payload.qrTargetUrl, id);
            payload.qrCode = this.buildQrCode(payload.qrTargetUrl);
        }
        const updatedCity = await index_1.cityModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return updatedCity;
    }
    async deleteCityByIdService(id) {
        const objectId = new mongoose_1.Types.ObjectId(id);
        const deletedCity = await index_1.cityModel.findByIdAndUpdate(objectId, { $set: { isDeleted: true } }, { new: true });
        const jobResult = await index_1.jobModel.updateMany({ city: objectId, isDeleted: { $ne: true } }, { $set: { isDeleted: true } });
        const companyResult = await index_1.employerModel.updateMany({ city: objectId, isDeleted: { $ne: true } }, { $set: { isDeleted: true } });
        logger_1.default.info(`[deleteCity] Soft-deleted ${jobResult.modifiedCount} job(s) and ` +
            `${companyResult.modifiedCount} company(ies) linked to city ${id}`);
        return deletedCity;
    }
    async getAllDeletedCitiesService(payload) {
        const { searchValue, pageNo, recordPerPage, creatorFilter } = payload;
        const filter = {
            isDeleted: true,
            ...(creatorFilter ?? {}),
        };
        if (searchValue) {
            filter.name = { $regex: new RegExp(searchValue, "i") };
        }
        const limit = parseInt(String(recordPerPage || "10"));
        const skip = ((parseInt(String(pageNo)) || 1) - 1) * limit;
        const [total, cities] = await Promise.all([
            index_1.cityModel.countDocuments(filter),
            index_1.cityModel
                .find(filter)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
        ]);
        const data = await Promise.all(cities.map(async (city) => {
            const [linkedJobsCount, linkedCompaniesCount] = await Promise.all([
                index_1.jobModel.countDocuments({ city: city._id, isDeleted: true }),
                index_1.employerModel.countDocuments({ city: city._id, isDeleted: true }),
            ]);
            return { ...city, linkedJobsCount, linkedCompaniesCount };
        }));
        return {
            data,
            total,
            pageNo: parseInt(String(pageNo)) || 1,
            recordPerPage: limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async restoreCityByIdService(id) {
        const objectId = new mongoose_1.Types.ObjectId(id);
        const restoredCity = await index_1.cityModel.findByIdAndUpdate(objectId, { $set: { isDeleted: false } }, { new: true });
        const jobResult = await index_1.jobModel.updateMany({ city: objectId, isDeleted: true }, { $set: { isDeleted: false } });
        const companyResult = await index_1.employerModel.updateMany({ city: objectId, isDeleted: true }, { $set: { isDeleted: false } });
        logger_1.default.info(`[restoreCity] Restored ${jobResult.modifiedCount} job(s) and ` +
            `${companyResult.modifiedCount} company(ies) linked to city ${id}`);
        return restoredCity;
    }
    async hardDeleteCityByIdService(id) {
        const objectId = new mongoose_1.Types.ObjectId(id);
        await index_1.jobModel.deleteMany({ city: objectId, isDeleted: true });
        await index_1.employerModel.deleteMany({ city: objectId, isDeleted: true });
        const deletedCity = await index_1.cityModel.findByIdAndDelete(objectId);
        return deletedCity;
    }
    async getAllCitiesFrontendService() {
        const cities = await index_1.cityModel.find({
            status: true,
            isDeleted: { $ne: true },
        });
        return cities;
    }
}
exports.CityService = CityService;
//# sourceMappingURL=city.service.js.map