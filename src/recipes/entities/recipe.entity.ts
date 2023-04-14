import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

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
@Unique(['name'])
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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
