import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { RecipesModule } from '../recipes/recipes.module';
import { Order } from './entities/order.entity';
import { IngredientsModule } from 'src/ingredients/ingredients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    RecipesModule,
    IngredientsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
