import { contactQueryModel } from "../../models/index";
import { type ContactQuery } from "../../models/contactQuery";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class ContactService {
  public async addContactQueryService(payload: ContactQuery) {
    return await contactQueryModel.create(payload);
  }

  // Newest first; searchValue matches company, e-mail or phone.
  public async getContactQueriesService(
    searchValue: string,
    pageNo: number,
    recordPerPage: number,
  ) {
    const filter: Record<string, any> = {};
    if (searchValue) {
      const regex = new RegExp(escapeRegex(searchValue), "i");
      filter.$or = [
        { companyName: regex },
        { email: regex },
        { phoneNo: regex },
      ];
    }
    const [queries, total] = await Promise.all([
      contactQueryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNo - 1) * recordPerPage)
        .limit(recordPerPage),
      contactQueryModel.countDocuments(filter),
    ]);
    return { queries, total };
  }

  public async deleteContactQueryService(id: string) {
    return await contactQueryModel.findByIdAndDelete(id);
  }
}
