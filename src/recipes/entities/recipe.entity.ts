import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export enum RecipeType {
  COFFEE = 'coffee',
  TEA = 'tea',
}

export enum RecipeStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export type RecipeIngredients = {
  ingredientId: string;
  quantity: number;
  temperature: number;
  order: number;
};

@Entity()
export class Recipe {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  type: RecipeType;

  @Column()
  status: RecipeStatus;

  @Column()
  ingredients: RecipeIngredients[];
}
