import { Schema, model, type Document } from "mongoose";

// An e-mail address signed up through the newsletter form on the website.
export interface NewsletterSubscriber {
  email: string;
}

export interface NewsletterSubscriberDocument
  extends NewsletterSubscriber,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSubscriberSchema = new Schema<NewsletterSubscriberDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const _NewsletterSubscriberModel = model<NewsletterSubscriberDocument>(
  "NewsletterSubscriber",
  newsletterSubscriberSchema,
);

export default _NewsletterSubscriberModel;
