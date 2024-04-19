import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common';

@Injectable()
export class ValidationDateString implements PipeTransform {
  transform(value: string, _metadata: ArgumentMetadata) {
    if (Number.isNaN(Date.parse(value))) {
      throw new BadRequestException(`\`${value}\` isn't valid date string`);
    }
    return value;
  }
}
