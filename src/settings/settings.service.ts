import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: MongoRepository<Setting>,
  ) {}

  create(createSettingDto: CreateSettingDto) {
    return this.settingsRepository.save(createSettingDto);
  }

  findAll() {
    return this.settingsRepository.find();
  }

  findOne(id: ObjectID) {
    return this.settingsRepository.findOneBy({ _id: id });
  }

  findOneByName(name: string) {
    return this.settingsRepository.findOneBy({ name });
  }

  async update(id: ObjectID, updateSettingDto: UpdateSettingDto) {
    await this.settingsRepository.update(id, updateSettingDto);
  }

  remove(id: ObjectID) {
    return this.settingsRepository.delete(id);
  }
}
