import { type Schema } from "mongoose";
import { cityModel } from "../../models/index";
import { type CityDocument } from "../../models/city";

export class CityService {
  private buildQrCode(qrTargetUrl: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrTargetUrl)}`;
  }

  public async getAllCitiesService() {
    const cities = await cityModel.find();
    return cities;
  }

  public async getAllCitiesByFilter(payload) {
    const { searchValue, pageNo, recordPerPage } = payload;
    const filter: Record<string, any> = { isDeleted: false };
    if (searchValue) {
      filter.name = { $regex: new RegExp(searchValue, "i") };
    }

    const limit = parseInt(recordPerPage || "10");
    const skip = ((parseInt(pageNo) || 1) - 1) * limit;

    const [docs, cities] = await Promise.all([
      cityModel.countDocuments(filter),
      cityModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "createdBy", select: "username first_name last_name email" })
        .lean()
        .exec(),
    ]);

    const result = cities.map((city: any) => {
      let creatorName: string | null = null;
      let creatorEmail: string | null = null;
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

  public async getCityByIdService(id: string) {
    const city = await cityModel.findById(id);
    return city;
  }

  public async addCityService(data: CityDocument) {
    const { name, startTime, endTime, address, zipCode, directionLink } = data;
    const extra = data as any;
    const newCity = await cityModel.create({
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
      newCity.qrTargetUrl = extra.qrTargetUrl;
      newCity.qrCode = this.buildQrCode(extra.qrTargetUrl);
    }
    await newCity.save();
    return newCity;
  }

  public async updateCityByIdService(
    id: string,
    updatedData: Schema<CityDocument>,
  ) {
    const payload: any = { ...updatedData };
    if (payload.qrTargetUrl) {
      payload.qrCode = this.buildQrCode(payload.qrTargetUrl);
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
