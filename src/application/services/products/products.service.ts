import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from '~/application/dtos/products';
import { ProductsRepository } from '~/application/repositories/products.repository';
import { AllItemsResponse } from '~/application/responses';
import { BrandsService } from '~/application/services/brands';
import { CategoriesService } from '~/application/services/categories';
import { generateRandomString, generateSlug } from '~/common/utils';
import { BRAND_NOT_FOUND } from '~/content/errors/brand.error';
import { CATEGORY_NOT_FOUND } from '~/content/errors/category.error';
import {
  PRODUCT_ALREADY_EXISTS,
  PRODUCT_NOT_FOUND,
  PRODUCT_SKU_ALREADY_EXISTS,
} from '~/content/errors/product.error';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly _productsRepository: ProductsRepository,
    private readonly _categoriesService: CategoriesService,
    private readonly _brandsService: BrandsService,
  ) {}

  async getAll(filter: FilterProductDto): Promise<AllItemsResponse<Product>> {
    const flatSearchKeys = ['title', 'sku'];

    const select: Prisma.ProductSelect = {
      id: true,
      title: true,
      description: true,
      sku: true,
      price: true,
      features: true,
      specifications: true,
      images: true,
      warranty: true,
      deliveryInformation: true,
      slug: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    };

    const orderBy = filter.sort
      ? filter.sort.map((field) => ({
          [field.field]: field.value,
        }))
      : [];

    const where: Prisma.ProductWhereInput = {
      deletedAt: {
        equals: null,
      },
      OR: filter.search
        ? [
            ...flatSearchKeys.map((field) => ({
              [field]: {
                contains: filter.search,
                mode: 'insensitive',
              },
            })),
            {
              category: {
                name: {
                  contains: filter.search,
                  mode: 'insensitive',
                },
                deletedAt: {
                  equals: null,
                },
              },
            },
            {
              brand: {
                name: {
                  contains: filter.search,
                  mode: 'insensitive',
                },
                deletedAt: {
                  equals: null,
                },
              },
            },
          ]
        : undefined,
    };

    if (filter.filter && filter.filter.length > 0) {
      where.AND = filter.filter
        .filter((field) => !['category', 'brand'].includes(field.field))
        .map((field) => ({
          [field.field]: field.value,
        }));

      const categoryFilter = filter.filter.find(
        (field) => field.field === 'category',
      );
      const brandFilter = filter.filter.find(
        (field) => field.field === 'brand',
      );

      if (categoryFilter) {
        where.category = {
          name: {
            equals: categoryFilter.value,
          },
          deletedAt: {
            equals: null,
          },
        };
      }
      if (brandFilter) {
        where.brand = {
          name: {
            equals: brandFilter.value,
          },
          deletedAt: {
            equals: null,
          },
        };
      }
    }

    const count = await this._productsRepository.getProductsCount({ where });

    let { page, limit } = filter;
    let skip = 0;

    if (!filter.noPagination) {
      page = page as number;
      limit = limit as number;
      skip = (page - 1) * limit;
    }

    const products = await this._productsRepository.getAllProducts({
      select,
      where,
      orderBy,
      ...(!filter.noPagination
        ? {
            skip,
            take: limit,
          }
        : {}),
    });

    return {
      count,
      data: products,
    };
  }

  async getById(id: string): Promise<Product> {
    const product = await this._productsRepository.getUniqueProduct({
      select: {
        id: true,
        title: true,
        description: true,
        sku: true,
        price: true,
        features: true,
        specifications: true,
        images: true,
        warranty: true,
        deliveryInformation: true,
        slug: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      where: {
        id,
        deletedAt: {
          equals: null,
        },
      },
    });
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async create(payload: CreateProductDto): Promise<Product> {
    const existingProduct = await this._productsRepository.getFirstProduct({
      select: {
        id: true,
      },
      where: {
        sku: payload.sku,
        deletedAt: {
          equals: null,
        },
      },
    });

    if (existingProduct) {
      throw new BadRequestException(PRODUCT_ALREADY_EXISTS);
    }

    const category = await this._categoriesService.getById(payload.categoryId);
    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND);
    }

    if (payload.brandId) {
      const brand = await this._brandsService.getById(payload.brandId);
      if (!brand) {
        throw new NotFoundException(BRAND_NOT_FOUND);
      }
    }

    const slug = await this._generateSlug(payload.title);

    const data = {
      ...payload,
      slug,
    };

    const product = await this._productsRepository.createProduct({
      data,
    });
    return product;
  }

  async update(id: string, payload: UpdateProductDto): Promise<Product> {
    const product = await this.getById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    if (payload.sku) {
      const existingProduct = await this._productsRepository.getFirstProduct({
        select: {
          id: true,
        },
        where: {
          sku: payload.sku,
          deletedAt: {
            equals: null,
          },
          id: {
            not: id,
          },
        },
      });

      if (existingProduct) {
        throw new BadRequestException(PRODUCT_SKU_ALREADY_EXISTS);
      }
    }

    if (payload.categoryId) {
      const category = await this._categoriesService.getById(
        payload.categoryId,
      );
      if (!category) {
        throw new NotFoundException(CATEGORY_NOT_FOUND);
      }
    }

    if (payload.brandId) {
      const brand = await this._brandsService.getById(payload.brandId);
      if (!brand) {
        throw new NotFoundException(BRAND_NOT_FOUND);
      }
    }

    const where: Prisma.ProductWhereUniqueInput = {
      id,
      deletedAt: {
        equals: null,
      },
    };

    const data = {
      ...payload,
    };

    return this._productsRepository.updateProduct({
      where,
      data,
    });
  }

  async delete(id: string): Promise<void> {
    const product = await this.getById(id);

    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    const where: Prisma.ProductWhereUniqueInput = {
      id,
      deletedAt: {
        equals: null,
      },
    };
    const data: Prisma.ProductUpdateInput = {
      deletedAt: new Date(),
    };

    await this._productsRepository.updateProduct({
      where,
      data,
    });
  }

  private async _generateSlug(title: string): Promise<string> {
    const originalSlug = generateSlug(title);
    let slug = originalSlug;

    while (true) {
      const product = await this._productsRepository.getFirstProduct({
        where: {
          slug,
          deletedAt: {
            equals: null,
          },
        },
        select: {
          id: true,
        },
      });

      if (!product) {
        break;
      }
      slug = `${originalSlug}-${generateRandomString(8)}`;
    }

    return slug;
  }
}
