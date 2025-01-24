import { CreateProductDto, createProductSchema } from './create.dto';
import { FilterProductDto, filterProductSchema } from './filter.dto';
import { UpdateProductDto, updateProductSchema } from './update.dto';

export type { CreateProductDto, FilterProductDto, UpdateProductDto };
export { createProductSchema, filterProductSchema, updateProductSchema };
