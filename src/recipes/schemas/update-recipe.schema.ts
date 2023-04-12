import * as Joi from 'joi';
import { RecipeStatus, RecipeType } from '../entities/recipe.entity';

export const updateRecipeSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string(),
  type: Joi.string().valid(...Object.values(RecipeType)),
  status: Joi.string().valid(...Object.values(RecipeStatus)),
  ingredients: Joi.array().items(
    Joi.object({
      ingredientId: Joi.string().required(),
      quantity: Joi.number().positive().required(),
      temperature: Joi.number().required(),
      order: Joi.number().positive().required(),
    }),
  ),
});
