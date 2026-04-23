"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
const index_1 = require("../../models/index");
class CityService {
    async getAllCitiesService() {
        const cities = await index_1.cityModel.find();
        return cities;
    }
    async getAllCitiesByFilter(payload) {
        const { searchValue, pageNo, recordPerPage } = payload;
        const query = index_1.cityModel.find({ isDeleted: false }).sort({
            createdAt: -1,
        });
        if (searchValue) {
            void query.or([
                {
                    name: {
                        $regex: new RegExp(searchValue, "i"),
                    },
                },
            ]);
        }
        const docs = await index_1.cityModel
            .find({
            isDeleted: false,
        })
            .count();
        const limit = parseInt(recordPerPage || "10");
        const skip = (pageNo - 1) * limit;
        const result = await query.limit(limit).skip(skip).exec();
        return {
            count: Math.ceil(docs / Number(recordPerPage || 10)),
            result,
        };
    }
    async getCityByIdService(id) {
        const city = await index_1.cityModel.findById(id);
        return city;
    }
    async addCityService(data) {
        const { name, startTime, endTime, address, zipCode, directionLink } = data;
        const newCity = await index_1.cityModel.create({
            name,
            startTime,
            endTime,
            address,
            zipCode,
            directionLink,
        });
        return newCity;
    }
    async updateCityByIdService(id, updatedData) {
        const updatedCity = await index_1.cityModel.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        return updatedCity;
    }
    async deleteCityByIdService(id) {
        const deletedCity = await index_1.cityModel.findByIdAndDelete(id);
        return deletedCity;
    }
    async getAllCitiesFrontendService() {
        const cities = await index_1.cityModel.find({ status: true });
        return cities;
    }
}
exports.CityService = CityService;
//# sourceMappingURL=city.service.js.map