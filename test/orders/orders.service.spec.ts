import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RecipesService } from '../../src/recipes/recipes.service';
import { IngredientsService } from '../../src/ingredients/ingredients.service';
import { Order, OrderStatus } from '../../src/orders/entities/order.entity';
import { OrdersService } from '../../src/orders/orders.service';
import {
  Recipe,
  RecipeStatus,
  RecipeType,
} from '../../src/recipes/entities/recipe.entity';
import {
  Ingredient,
  IngredientType,
} from '../../src/ingredients/entities/ingredient.entity';
import { CreateOrderDto } from '../../src/orders/dto/create-order.dto';
import { UpdateOrderDto } from '../../src/orders/dto/update-order.dto';

describe('OrdersService', () => {
  let orderRepository: MongoRepository<Order>;
  let recipesService: RecipesService;
  let ingredientsService: IngredientsService;
  let ordersService: OrdersService;

  beforeAll(() => {
    // @ts-ignore
    orderRepository = new MongoRepository<Order>();
    ingredientsService = new IngredientsService(null);
    recipesService = new RecipesService(null, null, null);
    ordersService = new OrdersService(
      orderRepository,
      recipesService,
      ingredientsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateRecipe', () => {
    it('should throw BadRequestException because recipe was not found', async () => {
      const recipeId = '64342e031a1b721892473843';
      const findOneSpy = jest
        .spyOn(recipesService, 'findOne')
        .mockResolvedValueOnce(null);

      const promise = ordersService.validateRecipe(recipeId);

      expect(findOneSpy).toHaveBeenCalledWith(new ObjectID(recipeId));
      expect(promise).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException because recipe is disabled', async () => {
      const recipeId = '64342e031a1b721892473843';
      const recipe: Recipe = {
        id: new ObjectID(recipeId),
        name: 'recipe',
        type: RecipeType.COFFEE,
        status: RecipeStatus.DISABLED,
        ingredients: [],
      };

      const findOneSpy = jest
        .spyOn(recipesService, 'findOne')
        .mockResolvedValueOnce(recipe);

      const promise = ordersService.validateRecipe(recipeId);

      expect(findOneSpy).toHaveBeenCalledWith(new ObjectID(recipeId));
      expect(promise).rejects.toThrow(BadRequestException);
    });

    it('should validate and return a recipe object', async () => {
      const recipeId = '64342e031a1b721892473843';
      const recipe: Recipe = {
        id: new ObjectID(recipeId),
        name: 'recipe',
        type: RecipeType.COFFEE,
        status: RecipeStatus.ENABLED,
        ingredients: [],
      };

      const findOneSpy = jest
        .spyOn(recipesService, 'findOne')
        .mockResolvedValueOnce(recipe);

      const result = await ordersService.validateRecipe(recipeId);

      expect(findOneSpy).toHaveBeenCalledWith(new ObjectID(recipeId));
      expect(result).toEqual(recipe);
    });
  });

  describe('areIngredientsAvailable', () => {
    it('should return false because are not available ingredients', async () => {
      const ingredientId = '64342e031a1b721892473841';
      const ingredient: Ingredient = {
        id: new ObjectID(ingredientId),
        name: 'ingredient',
        preparationTime: 1000,
        type: IngredientType.LIQUID,
        availableQuantity: 20,
        maxQuantity: 100,
      };
      const recipeId = '64342e031a1b721892473843';
      const recipe: Recipe = {
        id: new ObjectID(recipeId),
        name: 'recipe',
        type: RecipeType.COFFEE,
        status: RecipeStatus.ENABLED,
        ingredients: [
          {
            ingredientId,
            quantity: 30,
            temperature: 30,
            order: 1,
          },
        ],
      };

      const findOneSpy = jest
        .spyOn(ingredientsService, 'findOne')
        .mockResolvedValueOnce(ingredient);

      const result = await ordersService.areIngredientsAvailable(recipe);

      expect(findOneSpy).toHaveBeenCalledWith(new ObjectID(ingredientId));
      expect(result).toBe(false);
    });

    it('should return true because are available ingredients', async () => {
      const ingredientId = '64342e031a1b721892473841';
      const ingredient: Ingredient = {
        id: new ObjectID(ingredientId),
        name: 'ingredient',
        preparationTime: 1000,
        type: IngredientType.LIQUID,
        availableQuantity: 30,
        maxQuantity: 100,
      };
      const recipeId = '64342e031a1b721892473843';
      const recipe: Recipe = {
        id: new ObjectID(recipeId),
        name: 'recipe',
        type: RecipeType.COFFEE,
        status: RecipeStatus.ENABLED,
        ingredients: [
          {
            ingredientId,
            quantity: 30,
            temperature: 30,
            order: 1,
          },
        ],
      };

      const findOneSpy = jest
        .spyOn(ingredientsService, 'findOne')
        .mockResolvedValueOnce(ingredient);

      const result = await ordersService.areIngredientsAvailable(recipe);

      expect(findOneSpy).toHaveBeenCalledWith(new ObjectID(ingredientId));
      expect(result).toBe(true);
    });
  });

  describe('create', () => {
    it('should save and return order', async () => {
      const recipeId = '64342e031a1b721892473843';
      const createOrderDto: CreateOrderDto = {
        recipeId,
        status: OrderStatus.PENDING,
      };

      const recipe: Recipe = {
        id: new ObjectID(recipeId),
        name: 'recipe',
        type: RecipeType.COFFEE,
        status: RecipeStatus.ENABLED,
        ingredients: [],
      };

      const order: Order = {
        id: new ObjectID('64342e031a1b721892473841'),
        recipeId: new ObjectID(recipeId),
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const validateRecipeSpy = jest
        .spyOn(ordersService, 'validateRecipe')
        .mockResolvedValueOnce(recipe);

      const areIngredientsAvailableSpy = jest
        .spyOn(ordersService, 'areIngredientsAvailable')
        .mockResolvedValueOnce(true);

      const saveSpy = jest
        .spyOn(orderRepository, 'save')
        .mockResolvedValueOnce(order);

      const result = await ordersService.create(createOrderDto);

      expect(validateRecipeSpy).toHaveBeenCalledWith(recipeId);
      expect(areIngredientsAvailableSpy).toHaveBeenCalledWith(recipe);
      expect(saveSpy).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(order);
    });

    it('should save order with missing_ingredients status', async () => {
      const recipeId = '64342e031a1b721892473843';
      const createOrderDto: CreateOrderDto = {
        recipeId,
        status: OrderStatus.PENDING,
      };

      const recipe: Recipe = {
        id: new ObjectID(recipeId),
        name: 'recipe',
        type: RecipeType.COFFEE,
        status: RecipeStatus.ENABLED,
        ingredients: [],
      };

      const order: Order = {
        id: new ObjectID('64342e031a1b721892473841'),
        recipeId: new ObjectID(recipeId),
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const validateRecipeSpy = jest
        .spyOn(ordersService, 'validateRecipe')
        .mockResolvedValueOnce(recipe);

      const areIngredientsAvailableSpy = jest
        .spyOn(ordersService, 'areIngredientsAvailable')
        .mockResolvedValueOnce(false);

      const saveSpy = jest
        .spyOn(orderRepository, 'save')
        .mockResolvedValueOnce(order);

      const result = await ordersService.create(createOrderDto);

      expect(validateRecipeSpy).toHaveBeenCalledWith(recipeId);
      expect(areIngredientsAvailableSpy).toHaveBeenCalledWith(recipe);
      expect(saveSpy).toHaveBeenCalledWith({
        ...createOrderDto,
        status: OrderStatus.MISSING_INGREDIENTS,
      });
      expect(result).toEqual(order);
    });

    it('should throw because recipe is not valid', async () => {
      const recipeId = '64342e031a1b721892473843';
      const createOrderDto: CreateOrderDto = {
        recipeId,
        status: OrderStatus.PENDING,
      };

      const validateRecipeSpy = jest
        .spyOn(ordersService, 'validateRecipe')
        .mockRejectedValueOnce(new BadRequestException());

      const areIngredientsAvailableSpy = jest.spyOn(
        ordersService,
        'areIngredientsAvailable',
      );

      const saveSpy = jest.spyOn(orderRepository, 'save');

      const promise = ordersService.create(createOrderDto);

      expect(validateRecipeSpy).toHaveBeenCalledWith(recipeId);
      expect(areIngredientsAvailableSpy).toHaveBeenCalledTimes(0);
      expect(saveSpy).toHaveBeenCalledTimes(0);
      expect(promise).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException because order was not found', async () => {
      const orderId = new ObjectID('64342e031a1b721892473843');
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.COMPLETED,
      };

      const findOneSpy = jest
        .spyOn(ordersService, 'findOne')
        .mockResolvedValueOnce(null);

      const validateRecipeSpy = jest.spyOn(ordersService, 'validateRecipe');
      const updateSpy = jest.spyOn(orderRepository, 'update');

      const promise = ordersService.update(orderId, updateOrderDto);

      expect(findOneSpy).toHaveBeenCalledWith(orderId);
      expect(validateRecipeSpy).toHaveBeenCalledTimes(0);
      expect(updateSpy).toHaveBeenCalledTimes(0);
      expect(promise).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException because order is completed', async () => {
      const recipeId = new ObjectID('64342e031a1b721892473841');
      const orderId = new ObjectID('64342e031a1b721892473843');
      const order: Order = {
        id: orderId,
        recipeId: recipeId,
        status: OrderStatus.COMPLETED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.CANCELLED,
      };

      const findOneSpy = jest
        .spyOn(ordersService, 'findOne')
        .mockResolvedValueOnce(order);

      const validateRecipeSpy = jest.spyOn(ordersService, 'validateRecipe');
      const updateSpy = jest.spyOn(orderRepository, 'update');

      const promise = ordersService.update(orderId, updateOrderDto);

      expect(findOneSpy).toHaveBeenCalledWith(orderId);
      expect(validateRecipeSpy).toHaveBeenCalledTimes(0);
      expect(updateSpy).toHaveBeenCalledTimes(0);
      expect(promise).rejects.toThrow(BadRequestException);
    });

    it('should update order', async () => {
      const recipeId = new ObjectID('64342e031a1b721892473841');
      const orderId = new ObjectID('64342e031a1b721892473843');
      const order: Order = {
        id: orderId,
        recipeId: recipeId,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateOrderDto: UpdateOrderDto = {
        status: OrderStatus.COMPLETED,
      };

      const findOneSpy = jest
        .spyOn(ordersService, 'findOne')
        .mockResolvedValueOnce(order);

      const validateRecipeSpy = jest
        .spyOn(ordersService, 'validateRecipe')
        .mockResolvedValueOnce(null);
      const updateSpy = jest
        .spyOn(orderRepository, 'update')
        .mockResolvedValueOnce(null);

      await ordersService.update(orderId, updateOrderDto);

      expect(findOneSpy).toHaveBeenCalledWith(orderId);
      expect(validateRecipeSpy).toHaveBeenCalledWith(order.recipeId, false);
      expect(updateSpy).toHaveBeenCalledWith(orderId, {
        ...order,
        ...updateOrderDto,
      });
    });
  });
});
