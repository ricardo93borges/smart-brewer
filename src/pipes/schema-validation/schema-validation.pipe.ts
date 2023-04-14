import { ObjectSchema, StringSchema } from 'joi';
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SchemaValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema | StringSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!['body', 'query'].includes(metadata.type)) return value;

    const { error } = this.schema.validate(value);
    if (error) {
      const errMessage = error.details.map((d) => d.message).join('.');
      throw new BadRequestException(errMessage);
    }
    return value;
  }
}
