import slugify from 'slugify';
import { isEmptyObject } from './is-empty-object';

export const generateSlug = (text: string, options: object = {}): string => {
  const slugOptions = isEmptyObject(options)
    ? {
        replacement: '-',
        lower: true,
        trim: true,
      }
    : options;
  return slugify(text, slugOptions);
};
