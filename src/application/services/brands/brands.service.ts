import {
  CreateBrandDto,
  FilterBrandDto,
  UpdateBrandDto,
} from '~/application/dtos/brands';
import { BrandsRepository } from '~/application/repositories/brands.repository';
import { AllItemsResponse } from '~/application/responses';
import { generateRandomString, generateSlug } from '~/common/utils';
import {
  BRAND_ALREADY_EXIST,
  BRAND_NOT_FOUND,
} from '~/content/errors/brand.error';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brand, Prisma } from '@prisma/client';

@Injectable()
export class BrandsService {
  constructor(private readonly _brandsRepository: BrandsRepository) {}

  async getAll(queries: FilterBrandDto): Promise<AllItemsResponse<Brand>> {
    const where: Prisma.BrandWhereInput = {
      deletedAt: {
        equals: null,
      },
      OR: queries.search
        ? [
            {
              name: {
                contains: queries.search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    };

    const orderBy = queries.sort
      ? queries.sort.map((field) => ({
          [field.field]: field.value,
        }))
      : [];

    const count = await this._brandsRepository.getBrandsCount({ where });
    const categories = await this._brandsRepository.getAllBrands({
      where,
      orderBy,
    });

    return {
      count,
      data: categories,
    };
  }

  async getById(id: string): Promise<Brand> {
    const brand = await this._brandsRepository.getUniqueBrand({
      where: {
        id,
        deletedAt: {
          equals: null,
        },
      },
    });
    if (!brand) {
      throw new NotFoundException(BRAND_NOT_FOUND);
    }
    return brand;
  }

  async create(payload: CreateBrandDto): Promise<Brand> {
    const existingBrand = await this._brandsRepository.getFirstBrand({
      where: {
        name: {
          equals: payload.name,
        },
        deletedAt: {
          equals: null,
        },
      },
    });

    if (existingBrand) {
      throw new BadRequestException(BRAND_ALREADY_EXIST);
    }

    const slug = await this._generateSlug(payload.name);

    const data = {
      ...payload,
      slug,
    };
    const brand = await this._brandsRepository.createBrand({ data });

    return brand;
  }

  async update(id: string, payload: UpdateBrandDto): Promise<Brand> {
    const where: Prisma.BrandWhereUniqueInput = {
      id,
      deletedAt: {
        equals: null,
      },
    };

    const brand = await this._brandsRepository.getUniqueBrand({ where });
    if (!brand) {
      throw new NotFoundException(BRAND_NOT_FOUND);
    }

    return this._brandsRepository.updateBrand({
      where,
      data: payload,
    });
  }

  async delete(id: string): Promise<void> {
    const where: Prisma.BrandWhereUniqueInput = {
      id,
      deletedAt: {
        equals: null,
      },
    };

    const brand = await this._brandsRepository.getUniqueBrand({ where });
    if (!brand) {
      throw new NotFoundException(BRAND_NOT_FOUND);
    }

    const data: Prisma.BrandUpdateInput = {
      deletedAt: new Date(),
    };

    await this._brandsRepository.updateBrand({
      where,
      data,
    });
  }

  private async _generateSlug(name: string): Promise<string> {
    const originalSlug = generateSlug(name);
    let slug = originalSlug;

    while (true) {
      const brand = await this._brandsRepository.getFirstBrand({
        select: {
          id: true,
        },
        where: {
          slug,
          deletedAt: {
            equals: null,
          },
        },
      });
      if (!brand) {
        break;
      }
      slug = `${originalSlug}-${generateRandomString(8)}`;
    }

    return slug;
  }
}
