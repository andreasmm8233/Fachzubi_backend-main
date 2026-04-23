import Joi from "joi";

export const editContentValidator = Joi.object({
  privacyPolicy: Joi.string().required().optional(),
  termsConditions: Joi.string().required().optional(),
  jobCoverLetter: Joi.string().required().optional(),
});
