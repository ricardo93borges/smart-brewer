import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum IngredientType {
  SOLID = 'solid',
  LIQUID = 'liquid',
}

@Entity()
@Unique(['name'])
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
