import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  MAIN_PORT: Joi.number().default(3000).required(),
  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432).required(),
  POSTGRES_DB: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
