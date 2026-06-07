import { regionModel } from "../../models/index";

export class RegionService {
  public async getAllRegionsService() {
    const regions = await regionModel.find({ isDeleted: false });
    return regions;
  }

  public async getAllRegionsByFilter(searchValue, pageNo, recordPerPage) {
    const query = regionModel.find({ isDeleted: false });

    // Add search functionality
    if (searchValue) {
      void query.or([
        {
          regionName: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      ]);
    }

    // Count total documents (for pagination)
    const docs = await regionModel
      .find({
        isDeleted: false,
      })
      .count();

    // Set up pagination
    const limit = parseInt(recordPerPage || "0");
    const skip = (pageNo - 1) * limit;

    // Apply pagination and execute the query
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

  public async getRegionByIdService(id: string) {
    const region = await regionModel.findById(id);
    return region;
  }

  public async addRegionService(regionName: string) {
    const newRegion = await regionModel.create({
      regionName,
    });
    return newRegion;
  }

  public async updateRegionByIdService(
    id: string,
    regionName: string,
  ) {
    const updatedRegion = await regionModel.findByIdAndUpdate(id, {
      $set: { regionName },
    }, { new: true });
    return updatedRegion;
  }

  public async deleteRegionByIdService(id: string) {
    const deletedRegion = await regionModel.findByIdAndUpdate(id, {
      $set: {
        isDeleted: true,
      },
    }, { new: true });
    return deletedRegion;
  }
}
