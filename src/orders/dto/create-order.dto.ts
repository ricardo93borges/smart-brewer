import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  recipeId: string;
  status: OrderStatus;
}
