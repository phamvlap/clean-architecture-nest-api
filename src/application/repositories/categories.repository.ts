import { PrismaService } from '~/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly _prismaService: PrismaService) {}

  async getAllCategories(
    args?: Prisma.CategoryFindManyArgs,
  ): Promise<Array<Category>> {
    return this._prismaService.category.findMany(args);
  }

  async getCategoriesCount(args: Prisma.CategoryCountArgs): Promise<number> {
    return this._prismaService.category.count(args);
  }

  async getUniqueCategory(
    args: Prisma.CategoryFindUniqueArgs,
  ): Promise<Category | null> {
    return this._prismaService.category.findUnique(args);
  }

  async getFirstCategory(
    args: Prisma.CategoryFindFirstArgs,
  ): Promise<Category | null> {
    return this._prismaService.category.findFirst(args);
  }

  async createCategory(args: Prisma.CategoryCreateArgs): Promise<Category> {
    return this._prismaService.category.create(args);
  }

  async updateCategory(args: Prisma.CategoryUpdateArgs): Promise<Category> {
    return this._prismaService.category.update(args);
  }
}
