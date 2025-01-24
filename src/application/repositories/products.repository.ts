import { PrismaService } from '~/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsRepository {
  constructor(private readonly _prismaService: PrismaService) {}

  async getAllProducts(
    args: Prisma.ProductFindManyArgs,
  ): Promise<Array<Product>> {
    return this._prismaService.product.findMany(args);
  }

  async getProductsCount(args: Prisma.ProductCountArgs): Promise<number> {
    return this._prismaService.product.count(args);
  }

  async getUniqueProduct(
    args: Prisma.ProductFindUniqueArgs,
  ): Promise<Product | null> {
    return this._prismaService.product.findUnique(args);
  }

  async getFirstProduct(
    args: Prisma.ProductFindFirstArgs,
  ): Promise<Product | null> {
    return this._prismaService.product.findFirst(args);
  }

  async createProduct(args: Prisma.ProductCreateArgs): Promise<Product> {
    return this._prismaService.product.create(args);
  }

  async updateProduct(args: Prisma.ProductUpdateArgs): Promise<Product> {
    return this._prismaService.product.update(args);
  }
}
