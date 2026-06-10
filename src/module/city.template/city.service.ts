import { type Schema, Types } from "mongoose";
import { cityModel, jobModel, employerModel } from "../../models/index";
import { type CityDocument } from "../../models/city";
import logger from "../../utils/logger";

export class CityService {
  private buildQrCode(qrTargetUrl: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrTargetUrl)}`;
  }

  private formatQrTargetUrl(url: string, id: string): string {
    const match = url.match(/\/+jobs\/+/);
    if (!match) return url;

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
      newCity.qrTargetUrl = this.formatQrTargetUrl(extra.qrTargetUrl, newCity._id.toString());
      newCity.qrCode = this.buildQrCode(newCity.qrTargetUrl);
    }
    await newCity.save();

    if (extra.duplicateFromCityId) {
      logger.info(`[DuplicateCity] Starting job cloning from source city ID ${extra.duplicateFromCityId}`);
      try {
        const originalCityObjectId = new Types.ObjectId(extra.duplicateFromCityId);
        
        // 1. Direct query matching ObjectId or String ID
        let originalJobs = await jobModel.find({
          $or: [
            { city: originalCityObjectId },
            { city: extra.duplicateFromCityId.toString() }
          ],
          isDeleted: { $ne: true },
        });

        // 2. Fallback query retrieving all active jobs and filtering manually (guarantees match)
        if (originalJobs.length === 0) {
          const allActiveJobs = await jobModel.find({ isDeleted: { $ne: true } });
          originalJobs = allActiveJobs.filter((job: any) => {
            const cities = job.city || [];
            return cities.some((cId: any) => cId.toString() === extra.duplicateFromCityId.toString());
          });
        }

        logger.info(`[DuplicateCity] Found ${originalJobs.length} jobs to clone from city ID ${extra.duplicateFromCityId}`);

        const employerClonesMap = new Map<string, Types.ObjectId>();

        for (const job of originalJobs) {
          const clonedJob = job.toObject() as any;
          delete clonedJob._id;
          delete clonedJob.id;
          delete clonedJob.createdAt;
          delete clonedJob.updatedAt;

          clonedJob.city = (clonedJob.city || []).map((cId: any) =>
            cId.toString() === extra.duplicateFromCityId.toString() ? newCity._id : cId
          );

          const originalEmployerId = job.company ? job.company.toString() : null;
          let clonedEmployerId = originalEmployerId ? employerClonesMap.get(originalEmployerId) : undefined;

          if (originalEmployerId && !clonedEmployerId) {
            const originalEmployer = await employerModel.findOne({ _id: job.company, isDeleted: { $ne: true } });
            if (originalEmployer) {
              const clonedEmployerData = originalEmployer.toObject() as any;
              delete clonedEmployerData._id;
              delete clonedEmployerData.id;
              delete clonedEmployerData.createdAt;
              delete clonedEmployerData.updatedAt;

              clonedEmployerData.city = newCity._id;
              clonedEmployerData.isDeleted = false; // Ensure cloned employer is not deleted

              const newEmployer = await employerModel.create(clonedEmployerData);
              clonedEmployerId = newEmployer._id;
              employerClonesMap.set(originalEmployerId, newEmployer._id);
              logger.info(`[DuplicateCity] Cloned employer ${originalEmployer.companyName} to new city ${newCity.name} (New Employer ID: ${newEmployer._id})`);
            }
          }

          if (clonedEmployerId) {
            clonedJob.company = clonedEmployerId;
          }

          await jobModel.create(clonedJob);
        }
      } catch (err) {
        logger.error("[DuplicateCity] Error cloning jobs:", err);
      }
    }

    return newCity;
  }

  public async updateCityByIdService(
    id: string,
    updatedData: Schema<CityDocument>,
  ) {
    const payload: any = { ...updatedData };
    if (payload.qrTargetUrl) {
      payload.qrTargetUrl = this.formatQrTargetUrl(payload.qrTargetUrl, id);
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
