import { type Schema } from "mongoose";
import { cityModel } from "../../models/index";
import { type CityDocument } from "../../models/city";

export class CityService {
  private slugifyCity(cityName: string) {
    return encodeURIComponent(
      cityName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    );
  }

  private buildCityQrData(cityName: string) {
    const frontendUrl = (process.env.FRONTEND_URL ?? "").replace(/\/+$/, "");
    const citySlug = this.slugifyCity(cityName);
    const qrTargetUrl = `${frontendUrl}/jobs/${citySlug}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      qrTargetUrl,
    )}`;
    return { qrCode, qrTargetUrl };
  }

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
    const { qrCode, qrTargetUrl } = this.buildCityQrData(name);
    const newCity = await cityModel.create({
      name,
      startTime,
      endTime,
      address,
      zipCode,
      directionLink,
      qrCode,
      qrTargetUrl,
    });
    return newCity;
  }

  public async updateCityByIdService(
    id: string,
    updatedData: Schema<CityDocument>,
  ) {
    const payload: any = { ...updatedData };
    if (payload.name) {
      const { qrCode, qrTargetUrl } = this.buildCityQrData(payload.name);
      payload.qrCode = qrCode;
      payload.qrTargetUrl = qrTargetUrl;
    }
    const updatedCity = await cityModel.findByIdAndUpdate(id, payload, {
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
