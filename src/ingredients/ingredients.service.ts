import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: MongoRepository<Ingredient>,
  ) {}

  create(createIngredientDto: CreateIngredientDto) {
    return this.ingredientRepository.save(createIngredientDto);
  }

  findAll() {
    return this.ingredientRepository.find();
  }

  findOne(id: ObjectID) {
    return this.ingredientRepository.findOneBy({ _id: id });
  }

  async update(id: ObjectID, updateIngredientDto: UpdateIngredientDto) {
    await this.ingredientRepository.update(id, updateIngredientDto);
  }

  remove(id: ObjectID) {
    return this.ingredientRepository.delete(id);
  }
}
