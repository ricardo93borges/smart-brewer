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
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { SchemaValidationPipe } from '../pipes/schema-validation/schema-validation.pipe';
import { ParseObjectIdPipe } from '../pipes/parse-object-id/parse-object-id.pipe';
import { createIngredientSchema } from './schemas/create-ingredient.schema';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @UsePipes(new SchemaValidationPipe(createIngredientSchema))
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new SchemaValidationPipe(createIngredientSchema))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.ingredientsService.remove(id);
  }
}
