import { Module } from '@nestjs/common';
import { HandlebarsService } from './handlebars.service';

@Module({
  providers: [HandlebarsService],
  exports: [HandlebarsService],
})
export class HandlebarsModule {}
