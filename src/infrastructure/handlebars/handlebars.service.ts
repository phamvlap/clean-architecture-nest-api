import Handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandlebarsService {
  compile(template: string, data: any): string {
    const compiledTemplate = Handlebars.compile(template);
    const content = compiledTemplate(data);

    return content;
  }
}
