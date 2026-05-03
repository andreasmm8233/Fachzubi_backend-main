import Joi from "joi";

const permissionsSchema = Joi.object({
  manage_jobs: Joi.boolean(),
  manage_cities: Joi.boolean(),
  manage_employers: Joi.boolean(),
  manage_industries: Joi.boolean(),
  job_types: Joi.boolean(),
  manage_content: Joi.boolean(),
});

export const createEmployeeValidator = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
  permissions: permissionsSchema,
});

export const updateEmployeeValidator = Joi.object({
  id: Joi.string().required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  isActive: Joi.boolean(),
  password: Joi.string().min(8),
  permissions: permissionsSchema,
});

export const loginEmployeeValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
