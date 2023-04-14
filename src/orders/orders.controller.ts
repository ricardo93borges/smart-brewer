import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  HttpCode,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SchemaValidationPipe } from '../pipes/schema-validation/schema-validation.pipe';
import { createOrderSchema } from './schemas/create-order.schema';
import { ParseObjectIdPipe } from '../pipes/parse-object-id/parse-object-id.pipe';
import { updateOrderSchema } from './schemas/update-order.schema';
import { findOrdersSchema } from './schemas/find-orders.schema';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new SchemaValidationPipe(createOrderSchema))
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @UsePipes(new SchemaValidationPipe(findOrdersSchema))
  findAll(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new SchemaValidationPipe(updateOrderSchema))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.ordersService.remove(id);
  }
}
