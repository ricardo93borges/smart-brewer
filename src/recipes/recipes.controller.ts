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
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { SchemaValidationPipe } from '../pipes/schema-validation/schema-validation.pipe';
import { createRecipeSchema } from './schemas/create-recipe.schema';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id/parse-object-id.pipe';
import { updateRecipeSchema } from './schemas/update-recipe.schema';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UsePipes(new SchemaValidationPipe(createRecipeSchema))
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new SchemaValidationPipe(updateRecipeSchema))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.recipesService.remove(id);
  }
}
