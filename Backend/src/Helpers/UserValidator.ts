import Joi from "joi";

export const UserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  name: Joi.string().required(),
});

export const UserSchema2 = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});
