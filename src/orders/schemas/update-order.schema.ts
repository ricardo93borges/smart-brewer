import * as Joi from 'joi';
import { OrderStatus } from '../entities/order.entity';

export const updateOrderSchema: Joi.ObjectSchema = Joi.object({
  recipeId: Joi.string(),
  status: Joi.string().valid(...Object.values(OrderStatus)),
});
