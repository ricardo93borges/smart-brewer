import * as Joi from 'joi';
import { OrderStatus } from '../entities/order.entity';

export const findOrdersSchema: Joi.StringSchema = Joi.string().valid(
  ...Object.values(OrderStatus),
);
