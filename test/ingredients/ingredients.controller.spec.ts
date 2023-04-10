import { Test } from '@nestjs/testing';
import { ObjectID } from 'mongodb';
import {
  Ingredient,
  IngredientType,
} from '../../src/ingredients/entities/ingredient.entity';
import { IngredientsController } from '../../src/ingredients/ingredients.controller';
import { IngredientsService } from '../../src/ingredients/ingredients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateIngredientDto } from 'src/ingredients/dto/create-ingredient.dto';
import { UpdateIngredientDto } from 'src/ingredients/dto/update-ingredient.dto';

describe('IngredientsController', () => {
  let ingredientsController: IngredientsController;
  let ingredientsService: IngredientsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [IngredientsController],
      providers: [
        IngredientsService,
        {
          provide: getRepositoryToken(Ingredient),
          useValue: {
            save: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    ingredientsService = moduleRef.get<IngredientsService>(IngredientsService);
    ingredientsController = moduleRef.get<IngredientsController>(
      IngredientsController,
    );
  });

  describe('create', () => {
    it('should call ingredientsService create method', async () => {
      const createIngredientDto: CreateIngredientDto = {
        name: 'milk',
        preparationTime: 3000,
        type: IngredientType.LIQUID,
        availableQuantity: 100,
        maxQuantity: 1000,
      };

      const ingredient = {
        ...createIngredientDto,
        id: new ObjectID('64342e031a1b721892473843'),
      };

      const createSpy = jest
        .spyOn(ingredientsService, 'create')
        .mockResolvedValueOnce(ingredient);

      const result = await ingredientsController.create(createIngredientDto);

      expect(createSpy).toHaveBeenCalledWith(createIngredientDto);
      expect(result).toBe(ingredient);
    });
  });

  describe('findAll', () => {
    it('should return an array of ingredients', async () => {
      const ingredients = [
        {
          id: new ObjectID('64342e031a1b721892473843'),
          name: 'milk',
          preparationTime: 3000,
          type: IngredientType.LIQUID,
          availableQuantity: 100,
          maxQuantity: 1000,
        },
      ];

      jest
        .spyOn(ingredientsService, 'findAll')
        .mockResolvedValueOnce(ingredients);

      const result = await ingredientsController.findAll();

      expect(result).toBe(ingredients);
    });
  });

  describe('findOne', () => {
    it('should return an ingredient', async () => {
      const id = '64342e031a1b721892473843';
      const ingredient = {
        id: new ObjectID(id),
        name: 'milk',
        preparationTime: 3000,
        type: IngredientType.LIQUID,
        availableQuantity: 100,
        maxQuantity: 1000,
      };

      const findOneSpy = jest
        .spyOn(ingredientsService, 'findOne')
        .mockResolvedValueOnce(ingredient);

      const result = await ingredientsController.findOne(id);

      expect(findOneSpy).toHaveBeenCalledWith(+id);
      expect(result).toBe(ingredient);
    });
  });

  describe('update', () => {
    it('should call ingredientsService update method', async () => {
      const id = '64342e031a1b721892473843';
      const updateIngredientDto: UpdateIngredientDto = {
        name: 'milk',
        preparationTime: 3000,
        type: IngredientType.LIQUID,
        availableQuantity: 100,
        maxQuantity: 1000,
      };
      const updateSpy = jest
        .spyOn(ingredientsService, 'update')
        .mockResolvedValueOnce({ raw: '', affected: 1, generatedMaps: [] });

      const result = await ingredientsController.update(
        id,
        updateIngredientDto,
      );

      expect(updateSpy).toHaveBeenCalledWith(+id, updateIngredientDto);
      expect(result).toEqual({ raw: '', affected: 1, generatedMaps: [] });
    });
  });

  describe('remove', () => {
    it('should call ingredientsService remove method', async () => {
      const id = '64342e031a1b721892473843';

      const removeSpy = jest
        .spyOn(ingredientsService, 'remove')
        .mockResolvedValueOnce({ raw: '', affected: 1 });

      const result = await ingredientsController.remove(id);

      expect(removeSpy).toHaveBeenCalledWith(+id);
      expect(result).toEqual({ raw: '', affected: 1 });
    });
  });
});
