import Joi from "joi";

export const addContactQueryValidator = Joi.object({
  companyName: Joi.string().trim().max(200).required(),
  email: Joi.string().trim().email().max(200).required(),
  phoneNo: Joi.string().trim().max(50).required(),
  description: Joi.string().trim().max(5000).allow("").optional(),
});
