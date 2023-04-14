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
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { createSettingsSchema } from './schemas/create-settings.schema';
import { SchemaValidationPipe } from 'src/pipes/schema-validation/schema-validation.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id/parse-object-id.pipe';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UsePipes(new SchemaValidationPipe(createSettingsSchema))
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.settingsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new SchemaValidationPipe(createSettingsSchema))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.update(id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.settingsService.remove(id);
  }
}
