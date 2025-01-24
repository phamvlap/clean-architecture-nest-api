import {
  CreateCategoryDto,
  FilterCategoryDto,
  UpdateCategoryDto,
} from '~/application/dtos/categories';
import { CategoriesRepository } from '~/application/repositories/categories.repository';
import { AllItemsResponse } from '~/application/responses';
import { generateRandomString, generateSlug } from '~/common/utils';
import {
  CATEGORY_ALREADY_EXISTS,
  CATEGORY_NOT_FOUND,
} from '~/content/errors/category.error';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly _categoriesRepository: CategoriesRepository) {}

  async getAll(
    queries: FilterCategoryDto,
  ): Promise<AllItemsResponse<Category>> {
    const orderBy = queries.sort
      ? queries.sort.map((field) => ({
          [field.field]: field.value,
        }))
      : [];

    const where: Prisma.CategoryWhereInput = {
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

    const count = await this._categoriesRepository.getCategoriesCount({
      where,
    });

    const categories = await this._categoriesRepository.getAllCategories({
      where,
      orderBy,
    });
    return {
      count,
      data: categories,
    };
  }

  async getById(id: string): Promise<Category> {
    const category = await this._categoriesRepository.getUniqueCategory({
      where: {
        id,
        deletedAt: {
          equals: null,
        },
      },
    });
    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND);
    }
    return category;
  }

  async create(payload: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this._categoriesRepository.getFirstCategory({
      where: {
        name: {
          equals: payload.name,
        },
        deletedAt: {
          equals: null,
        },
      },
    });

    if (existingCategory) {
      throw new BadRequestException(CATEGORY_ALREADY_EXISTS);
    }

    const slug = await this._generateSlug(payload.name);

    const data: Prisma.CategoryCreateInput = {
      ...payload,
      slug,
    };
    const category = await this._categoriesRepository.createCategory({
      data,
    });
    return category;
  }

  async update(id: string, payload: UpdateCategoryDto): Promise<Category> {
    const where: Prisma.CategoryWhereUniqueInput = {
      id,
      deletedAt: {
        equals: null,
      },
    };

    const category = await this._categoriesRepository.getUniqueCategory({
      where,
    });
    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND);
    }

    return this._categoriesRepository.updateCategory({
      where,
      data: payload,
    });
  }

  async delete(id: string): Promise<void> {
    const where: Prisma.CategoryWhereUniqueInput = {
      id,
      deletedAt: {
        equals: null,
      },
    };

    const category = await this._categoriesRepository.getUniqueCategory({
      where,
    });

    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND);
    }

    const data = {
      deletedAt: new Date(),
    };

    await this._categoriesRepository.updateCategory({
      where,
      data,
    });
  }

  private async _generateSlug(name: string): Promise<string> {
    const originalSlug = generateSlug(name);
    let slug = originalSlug;

    while (true) {
      const category = await this._categoriesRepository.getFirstCategory({
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
      if (!category) {
        break;
      }
      slug = `${originalSlug}-${generateRandomString(8)}`;
    }
    return slug;
  }
}
