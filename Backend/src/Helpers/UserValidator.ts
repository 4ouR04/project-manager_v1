import Joi from "joi";

export const UserSchema = Joi.object({
  Email: Joi.string().required().email(),
  Password: Joi.string().required().min(8),
  Name: Joi.string().required(),
});

export const UserSchema2 = Joi.object({
  Email: Joi.string().required().email(),
  Password: Joi.string().required().min(8),
});
