import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import {
  Ingredient,
  IngredientType,
} from '../../src/ingredients/entities/ingredient.entity';
import { IngredientsService } from '../../src/ingredients/ingredients.service';
import { CreateIngredientDto } from '../../src/ingredients/dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../../src/ingredients/dto/update-ingredient.dto';

describe('IngredientsService', () => {
  let ingredientRepository: MongoRepository<Ingredient>;
  let ingredientsService: IngredientsService;

  beforeAll(() => {
    // @ts-ignore
    ingredientRepository = new MongoRepository<Ingredient>();
    ingredientsService = new IngredientsService(ingredientRepository);
  });

  describe('create', () => {
    it('should call Ingredient repository save method', async () => {
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

      const saveSpy = jest
        .spyOn(ingredientRepository, 'save')
        .mockResolvedValueOnce(ingredient);

      const result = await ingredientsService.create(createIngredientDto);

      expect(saveSpy).toHaveBeenCalledWith(createIngredientDto);
      expect(result).toEqual(ingredient);
    });
  });

  describe('findAll', () => {
    it('should call Ingredient repository find method', async () => {
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

      const findSpy = jest
        .spyOn(ingredientRepository, 'find')
        .mockResolvedValueOnce(ingredients);

      const result = await ingredientsService.findAll();

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(ingredients);
    });
  });

  describe('findOne', () => {
    it('should call Ingredient repository findOneBy method', async () => {
      const id = '64342e031a1b721892473843';
      const ingredient = {
        id: new ObjectID(id),
        name: 'milk',
        preparationTime: 3000,
        type: IngredientType.LIQUID,
        availableQuantity: 100,
        maxQuantity: 1000,
      };

      const findOneBySpy = jest
        .spyOn(ingredientRepository, 'findOneBy')
        .mockResolvedValueOnce(ingredient);

      const result = await ingredientsService.findOne(id);

      expect(findOneBySpy).toHaveBeenCalledWith({ _id: id });
      expect(result).toBe(ingredient);
    });
  });

  describe('update', () => {
    it('should call Ingredient repository update method', async () => {
      const id = '64342e031a1b721892473843';
      const updateIngredientDto: UpdateIngredientDto = {
        name: 'milk',
        preparationTime: 3000,
        type: IngredientType.LIQUID,
        availableQuantity: 100,
        maxQuantity: 1000,
      };
      const updateSpy = jest
        .spyOn(ingredientRepository, 'update')
        .mockResolvedValueOnce({ raw: '', affected: 1, generatedMaps: [] });

      const result = await ingredientsService.update(+id, updateIngredientDto);

      expect(updateSpy).toHaveBeenCalledWith(+id, updateIngredientDto);
      expect(result).toEqual({ raw: '', affected: 1, generatedMaps: [] });
    });
  });

  describe('remove', () => {
    it('should call Ingredient repository delete method', async () => {
      const id = '64342e031a1b721892473843';

      const deleteSpy = jest
        .spyOn(ingredientRepository, 'delete')
        .mockResolvedValueOnce({ raw: '', affected: 1 });

      const result = await ingredientsService.remove(+id);

      expect(deleteSpy).toHaveBeenCalledWith(+id);
      expect(result).toEqual({ raw: '', affected: 1 });
    });
  });
});
