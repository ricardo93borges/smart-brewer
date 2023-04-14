import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe, RecipeStatus } from '../recipes/entities/recipe.entity';
import { IngredientsService } from '../ingredients/ingredients.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: MongoRepository<Order>,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
  ) {}

  async validateRecipe(
    recipeId: string,
    validateStatus = true,
  ): Promise<Recipe> {
    const recipe = await this.recipesService.findOne(new ObjectID(recipeId));

    if (!recipe) {
      throw new BadRequestException('recipe does not exist');
    }

    if (validateStatus && recipe.status === RecipeStatus.DISABLED) {
      throw new BadRequestException('recipe is not enabled');
    }

    return recipe;
  }

  async areIngredientsAvailable(recipe: Recipe): Promise<boolean> {
    const ingredientsIds = recipe.ingredients.map((i) => i.ingredientId);

    const ingredients = await Promise.all(
      ingredientsIds.map((id) =>
        this.ingredientsService.findOne(new ObjectID(id)),
      ),
    );

    for (const recipeIngredient of recipe.ingredients) {
      const ingredient = ingredients.find(
        (i) => i.id.toString() === recipeIngredient.ingredientId,
      );

      if (recipeIngredient.quantity > ingredient.availableQuantity)
        return false;
    }

    return true;
  }

  async create(createOrderDto: CreateOrderDto) {
    const { recipeId } = createOrderDto;

    const recipe = await this.validateRecipe(recipeId);
    const areIngredientsAvailable = await this.areIngredientsAvailable(recipe);

    const status = areIngredientsAvailable
      ? createOrderDto.status
      : OrderStatus.MISSING_INGREDIENTS;

    return this.orderRepository.save({ ...createOrderDto, status });
  }

  findAll(status?: OrderStatus) {
    if (status) {
      return this.orderRepository.findBy({ status: status });
    }
    return this.orderRepository.find();
  }

  findOne(id: ObjectID) {
    return this.orderRepository.findOneBy({ _id: id });
  }

  async update(id: ObjectID, updateOrderDto: UpdateOrderDto) {
    let order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException('order not found');
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('completed order cannot be updated');
    }

    order = { ...order, ...updateOrderDto };

    await this.validateRecipe(order.recipeId, false);
    await this.orderRepository.update(id, order);
  }

  remove(id: ObjectID) {
    return this.orderRepository.delete(id);
  }
}
