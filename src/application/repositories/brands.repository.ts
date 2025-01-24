import { PrismaService } from '~/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Brand, Prisma } from '@prisma/client';

@Injectable()
export class BrandsRepository {
  constructor(private readonly _prismaService: PrismaService) {}

  async getAllBrands(args?: Prisma.BrandFindManyArgs): Promise<Array<Brand>> {
    return this._prismaService.brand.findMany(args);
  }

  async getBrandsCount(args: Prisma.BrandCountArgs): Promise<number> {
    return this._prismaService.brand.count(args);
  }

  async getUniqueBrand(
    args: Prisma.BrandFindUniqueArgs,
  ): Promise<Brand | null> {
    return this._prismaService.brand.findUnique(args);
  }

  async getFirstBrand(args: Prisma.BrandFindFirstArgs): Promise<Brand | null> {
    return this._prismaService.brand.findFirst(args);
  }

  async createBrand(args: Prisma.BrandCreateArgs): Promise<Brand> {
    return this._prismaService.brand.create(args);
  }

  async updateBrand(args: Prisma.BrandUpdateArgs): Promise<Brand> {
    return this._prismaService.brand.update(args);
  }
}
