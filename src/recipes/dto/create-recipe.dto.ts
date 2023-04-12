import {
  RecipeIngredients,
  RecipeStatus,
  RecipeType,
} from '../entities/recipe.entity';

export class CreateRecipeDto {
  name: string;
  type: RecipeType;
  status: RecipeStatus;
  ingredients: RecipeIngredients[];
}
