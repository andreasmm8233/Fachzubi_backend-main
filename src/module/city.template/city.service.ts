import { type Schema } from "mongoose";
import { cityModel } from "../../models/index";
import { type CityDocument } from "../../models/city";

export class CityService {
  public async getAllCitiesService() {
    const cities = await cityModel.find();
    return cities;
  }

  public async getAllCitiesByFilter(payload) {
    const { searchValue, pageNo, recordPerPage } = payload;
    const query = cityModel.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    // Add search functionality
    if (searchValue) {
      void query.or([
        {
          name: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      ]);
    }

    // Count total documents (for pagination)
    const docs = await cityModel
      .find({
        isDeleted: false,
      })
      .count();

    // Set up pagination
    const limit = parseInt(recordPerPage || "10");
    const skip = (pageNo - 1) * limit;

    // Apply pagination and execute the query
    const result = await query.limit(limit).skip(skip).exec();

    return {
      count: Math.ceil(docs / Number(recordPerPage || 10)),
      result,
    };
  }

  public async getCityByIdService(id: string) {
    const city = await cityModel.findById(id);
    return city;
  }

  public async addCityService(data: CityDocument) {
    const { name, startTime, endTime, address, zipCode, directionLink } = data;
    const newCity = await cityModel.create({
      name,
      startTime,
      endTime,
      address,
      zipCode,
      directionLink,
    });
    return newCity;
  }

  public async updateCityByIdService(
    id: string,
    updatedData: Schema<CityDocument>,
  ) {
    const updatedCity = await cityModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return updatedCity;
  }

  public async deleteCityByIdService(id: string) {
    const deletedCity = await cityModel.findByIdAndDelete(id);
    return deletedCity;
  }

  public async getAllCitiesFrontendService() {
    const cities = await cityModel.find({ status: true });
    return cities;
  }
}
