import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Ingredient } from '../../src/ingredients/entities/ingredient.entity';
import {
  Recipe,
  RecipeStatus,
  RecipeType,
} from '../../src/recipes/entities/recipe.entity';
import { RecipesService } from '../../src/recipes/recipes.service';
import { IngredientsService } from '../../src/ingredients/ingredients.service';
import { CreateRecipeDto } from '../../src/recipes/dto/create-recipe.dto';

describe('RecipesService', () => {
  let recipeRepository: MongoRepository<Recipe>;
  let recipesService: RecipesService;
  let ingredientsService: IngredientsService;

  beforeAll(() => {
    // @ts-ignore
    recipeRepository = new MongoRepository<Ingredient>();
    ingredientsService = new IngredientsService(null);
    recipesService = new RecipesService(recipeRepository, ingredientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should validate ingredients and call Recipe repository save method', async () => {
      const createRecipeDto: CreateRecipeDto = {
        name: 'milk',
        status: RecipeStatus.ENABLED,
        type: RecipeType.COFFEE,
        ingredients: [
          {
            ingredientId: '64342e031a1b721892473843',
            quantity: 1,
            temperature: 20,
            order: 1,
          },
        ],
      };

      const recipe = {
        ...createRecipeDto,
        id: new ObjectID('6436c2161056290e916b8678'),
      };

      const validateIngredientsSpy = jest
        .spyOn(recipesService, 'validateIngredients')
        .mockResolvedValueOnce();

      const saveSpy = jest
        .spyOn(recipeRepository, 'save')
        .mockResolvedValueOnce(recipe);

      const result = await recipesService.create(createRecipeDto);

      expect(saveSpy).toHaveBeenCalledWith(createRecipeDto);
      expect(validateIngredientsSpy).toHaveBeenCalledWith([
        '64342e031a1b721892473843',
      ]);
      expect(result).toEqual(recipe);
    });

    it('should throw because ingredients are not valid', async () => {
      const createRecipeDto: CreateRecipeDto = {
        name: 'milk',
        status: RecipeStatus.ENABLED,
        type: RecipeType.COFFEE,
        ingredients: [
          {
            ingredientId: '64342e031a1b721892473843',
            quantity: 1,
            temperature: 20,
            order: 1,
          },
        ],
      };

      const validateIngredientsSpy = jest
        .spyOn(recipesService, 'validateIngredients')
        .mockRejectedValueOnce(new BadRequestException());

      const saveSpy = jest
        .spyOn(recipeRepository, 'save')
        .mockResolvedValueOnce(null);

      const promise = recipesService.create(createRecipeDto);

      expect(promise).rejects.toThrow(BadRequestException);
      expect(saveSpy).toHaveBeenCalledTimes(0);
      expect(validateIngredientsSpy).toHaveBeenCalledWith([
        '64342e031a1b721892473843',
      ]);
    });
  });
});
