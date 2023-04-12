import * as Joi from 'joi';
import { OrderStatus } from '../entities/order.entity';

export const createOrderSchema: Joi.ObjectSchema = Joi.object({
  recipeId: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
});
