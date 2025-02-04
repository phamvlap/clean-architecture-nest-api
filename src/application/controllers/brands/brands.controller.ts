import {
  CreateBrandDto,
  FilterBrandDto,
  UpdateBrandDto,
  createBrandSchema,
  filterBrandSchema,
  updateBrandSchema,
} from '~/application/dtos/brands';
import { AllItemsResponse } from '~/application/responses';
import { BrandsService } from '~/application/services/brands';
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
import { Brand } from '@prisma/client';

@Controller('brands')
export class BrandsController {
  constructor(private readonly _brandsService: BrandsService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async getAll(
    @Query(new ZodValidationPipe(filterBrandSchema)) queries: FilterBrandDto,
  ): Promise<AllItemsResponse<Brand>> {
    return this._brandsService.getAll(queries);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Brand> {
    return this._brandsService.getById(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createBrandSchema)) body: CreateBrandDto,
  ): Promise<Brand> {
    return this._brandsService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBrandSchema)) body: UpdateBrandDto,
  ): Promise<Brand> {
    return this._brandsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this._brandsService.delete(id);
  }
}
