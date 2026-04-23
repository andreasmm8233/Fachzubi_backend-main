import { type ManageContent } from "../../models/manageContent";
import { manageContentModel } from "../../models/index";
import { type Schema } from "mongoose";

export class ManageContentService {
  public async getAllContentService() {
    const result = await manageContentModel.findOne();
    if (result) {
      result.id = result._id;
    }
    return result;
  }

  public async editContentService(updatedData: Schema<ManageContent>) {
    return await manageContentModel.findOneAndUpdate({}, updatedData, {
      new: true,
      upsert: true,
    });
  }
}
