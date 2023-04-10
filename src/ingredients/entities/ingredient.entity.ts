import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export enum IngredientType {
  SOLID = 'solid',
  LIQUID = 'liquid',
}

@Entity()
export class Ingredient {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  preparationTime: number;

  @Column()
  type: IngredientType;

  @Column()
  availableQuantity: number;

  @Column()
  maxQuantity: number;
}
