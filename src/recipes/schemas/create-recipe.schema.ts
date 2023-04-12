import * as Joi from 'joi';
import { RecipeStatus, RecipeType } from '../entities/recipe.entity';

export const createRecipeSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(RecipeType))
    .required(),
  status: Joi.string()
    .valid(...Object.values(RecipeStatus))
    .required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        ingredientId: Joi.string().required(),
        quantity: Joi.number().positive().required(),
        temperature: Joi.number().required(),
        order: Joi.number().positive().required(),
      }),
    )
    .required(),
});
