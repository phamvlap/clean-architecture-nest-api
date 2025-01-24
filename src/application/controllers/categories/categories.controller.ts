import {
  CreateCategoryDto,
  FilterCategoryDto,
  UpdateCategoryDto,
  createCategorySchema,
  filterCategorySchema,
  updateCategorySchema,
} from '~/application/dtos/categories';
import { AllItemsResponse } from '~/application/responses';
import { CategoriesService } from '~/application/services/categories';
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
} from '@nestjs/common';
import { Category } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly _categoriesService: CategoriesService) {}

  @Get()
  async getAll(
    @Query(new ZodValidationPipe(filterCategorySchema))
    queries: FilterCategoryDto,
  ): Promise<AllItemsResponse<Category>> {
    return this._categoriesService.getAll(queries);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Category> {
    return this._categoriesService.getById(id);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createCategorySchema)) body: CreateCategoryDto,
  ): Promise<Category> {
    return this._categoriesService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCategorySchema)) body: UpdateCategoryDto,
  ): Promise<Category> {
    return this._categoriesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this._categoriesService.delete(id);
  }
}
