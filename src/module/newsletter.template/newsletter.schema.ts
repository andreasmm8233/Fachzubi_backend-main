import Joi from "joi";

export const subscribeValidator = Joi.object({
  email: Joi.string().trim().email().max(200).required(),
});
