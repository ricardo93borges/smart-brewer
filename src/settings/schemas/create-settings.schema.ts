import * as Joi from 'joi';

export const createSettingsSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.string().required(),
});
