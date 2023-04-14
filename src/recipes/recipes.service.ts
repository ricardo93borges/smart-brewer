import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { IngredientsService } from '../ingredients/ingredients.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: MongoRepository<Recipe>,
    private ingredientsService: IngredientsService,
    private settingsService: SettingsService,
  ) {}

  async validateIngredients(ingredientsIds: string[]): Promise<void> {
    const ingredients = await Promise.all(
      ingredientsIds.map((id) =>
        this.ingredientsService.findOne(new ObjectID(id)),
      ),
    );

    const ingredientsFound = ingredients.filter((i) => !!i);
    if (ingredientsFound.length !== ingredientsIds.length) {
      throw new BadRequestException('some ingredients do not exist');
    }
  }

  async validateRecipeType(type: string): Promise<void> {
    const enabledRecipeTypes = await this.settingsService.findOneByName(
      'enabled_recipe_types',
    );

    if (
      enabledRecipeTypes &&
      !enabledRecipeTypes.value.split(',').includes(type)
    ) {
      throw new BadRequestException(
        `Recipe type not enabled. Types enabled: ${enabledRecipeTypes.value}`,
      );
    }
  }

  async create(createRecipeDto: CreateRecipeDto) {
    const { ingredients, type } = createRecipeDto;
    const ingredientsIds = ingredients.map((i) => i.ingredientId);

    await this.validateRecipeType(type);
    await this.validateIngredients(ingredientsIds);

    return this.recipeRepository.save(createRecipeDto);
  }

  findAll() {
    return this.recipeRepository.find();
  }

  findOne(id: ObjectID) {
    return this.recipeRepository.findOneBy({ _id: id });
  }

  async update(id: ObjectID, updateRecipeDto: UpdateRecipeDto) {
    let recipe = await this.findOne(id);

    if (!recipe) {
      throw new NotFoundException('recipe not found');
    }

    recipe = { ...recipe, ...updateRecipeDto };

    const ingredientsIds = recipe.ingredients.map((i) => i.ingredientId);
    await this.validateIngredients(ingredientsIds);

    await this.recipeRepository.update(id, recipe);
  }

  remove(id: ObjectID) {
    return this.recipeRepository.delete(id);
  }
}
