import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common';
import {isObjectId} from '../shared/helpers';

@Injectable()
export class ValidationObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isObjectId(value)) {
      throw new BadRequestException(`${value} isn't ObjectId type`);
    }
    return value;
  }
}
