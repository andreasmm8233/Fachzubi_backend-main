import Joi from "joi";

export const pricingPlanValidator = Joi.object({
  name: Joi.string().trim().max(100).required(),
  description: Joi.string().trim().max(1000).allow("").optional(),
  price: Joi.number().min(0).required(),
  duration: Joi.string().valid("month", "year").required(),
  features: Joi.array().items(Joi.string().trim().max(300)).default([]),
  sortOrder: Joi.number().integer().default(0),
  highlighted: Joi.boolean().default(false),
  priceNote: Joi.string().trim().max(200).allow("").optional(),
  buttonText: Joi.string().trim().max(100).allow("").optional(),
  badgeText: Joi.string().trim().max(60).allow("").optional(),
});
