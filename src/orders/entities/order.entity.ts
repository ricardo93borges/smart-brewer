import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  MISSING_INGREDIENTS = 'missing_ingredients',
}

@Entity()
export class Order {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  recipeId: string;

  @Column()
  status: OrderStatus;

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
