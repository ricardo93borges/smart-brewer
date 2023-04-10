import { IngredientType } from '../entities/ingredient.entity';

export class CreateIngredientDto {
  name: string;
  preparationTime: number;
  type: IngredientType;
  availableQuantity: number;
  maxQuantity: number;
}
