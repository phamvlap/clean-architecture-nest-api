import { ZodSchema } from 'zod';
import { ZOD_VALIDATION_ERROR } from '~/content/errors/zod-validation.error';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly _schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log({ metadata });
    try {
      const parsedValue = this._schema.parse(value);
      return parsedValue;
    } catch (error) {
      console.log({ error });
      throw new BadRequestException(ZOD_VALIDATION_ERROR);
    }
  }
}
