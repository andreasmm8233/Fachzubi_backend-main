import { newsletterSubscriberModel } from "../../models/index";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class NewsletterService {
  // Returns { subscriber, created } — created is false if the e-mail was
  // already on the list.
  public async subscribeService(email: string) {
    const normalized = email.trim().toLowerCase();
    const existing = await newsletterSubscriberModel.findOne({
      email: normalized,
    });
    if (existing) {
      return { subscriber: existing, created: false };
    }
    const subscriber = await newsletterSubscriberModel.create({
      email: normalized,
    });
    return { subscriber, created: true };
  }

  // Newest first; searchValue matches the e-mail.
  public async getSubscribersService(
    searchValue: string,
    pageNo: number,
    recordPerPage: number,
  ) {
    const filter: Record<string, any> = {};
    if (searchValue) {
      filter.email = new RegExp(escapeRegex(searchValue), "i");
    }
    const [subscribers, total] = await Promise.all([
      newsletterSubscriberModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNo - 1) * recordPerPage)
        .limit(recordPerPage),
      newsletterSubscriberModel.countDocuments(filter),
    ]);
    return { subscribers, total };
  }

  // Every subscriber, for the CSV export in the admin panel.
  public async getAllSubscribersService() {
    return await newsletterSubscriberModel
      .find({}, { email: 1, createdAt: 1 })
      .sort({ createdAt: -1 });
  }

  public async deleteSubscriberService(id: string) {
    return await newsletterSubscriberModel.findByIdAndDelete(id);
  }
}
