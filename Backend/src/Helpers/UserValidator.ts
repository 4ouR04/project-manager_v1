import Joi from "joi";
import { join } from "path";

export const userSchema = Joi.object({
  Name: Joi.string().required(),
  Email: Joi.string().required().email(),
  Password: Joi.string().required().min(8),
  Role: Joi.string(),
  isAssigned: Joi.boolean(),
});

export const UserSchema1 = Joi.object({
  Email: Joi.string().required().email(),
  Password: Joi.string().required().min(8),
});

export const projectSchema = Joi.object({
  ProjectName: Joi.string().required(),
  Description: Joi.string().required(),
  Due_date: Joi.date(),
  Status: Joi.string(),
  User: Joi.string()
})