import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
  createProductSchema,
  filterProductSchema,
  updateProductSchema,
} from '~/application/dtos/products';
import { AllItemsResponse } from '~/application/responses';
import { ProductsService } from '~/application/services/products';
import { PaginationInterceptor } from '~/common/interceptors';
import { ZodValidationPipe } from '~/common/pipes/zod-validation-pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Product } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly _productsService: ProductsService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async getAll(
    @Query(new ZodValidationPipe(filterProductSchema)) filter: FilterProductDto,
  ): Promise<AllItemsResponse<Product>> {
    return this._productsService.getAll(filter);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Product | null> {
    return this._productsService.getById(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createProductSchema)) body: CreateProductDto,
  ): Promise<Product> {
    return this._productsService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductSchema)) body: UpdateProductDto,
  ): Promise<Product> {
    return this._productsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this._productsService.delete(id);
  }
}
