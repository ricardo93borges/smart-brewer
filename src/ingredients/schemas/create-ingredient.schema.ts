import * as Joi from 'joi';
import { IngredientType } from '../entities/ingredient.entity';

export const createIngredientSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  preparationTime: Joi.number().required(),
  type: Joi.string()
    .valid(...Object.values(IngredientType))
    .required(),
  availableQuantity: Joi.number().required(),
  maxQuantity: Joi.number().required(),
});
