import { ObjectID } from 'mongodb';
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectID> {
  transform(value: any, metadata: ArgumentMetadata): ObjectID {
    try {
      return new ObjectID(value);
    } catch (error) {
      throw new BadRequestException('Invalid ID');
    }
  }
}
