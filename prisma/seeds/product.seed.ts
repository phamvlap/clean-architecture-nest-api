import { existsSync, lstatSync, readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import slugify from 'slugify';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Brand, Category, Prisma, PrismaClient } from '@prisma/client';

type CreateCategoryInput = {
  name: string;
};

type RawProductData = {
  title: string | null;
  url_source: string | null;
  description?: string;
  sku: string | null;
  price?: number;
  features?: Array<string>;
  specifications: string | null;
  images: Array<string> | null;
  warranty?: string;
  delivery_information: string | null;
  brand: string | null;
};

const DIR_NOT_FOUND = {
  code: 'dir_not_found',
  message: 'Directory not found',
};

const FILE_NOT_FOUND = {
  code: 'file_not_found',
  message: 'File not found',
};

const FILE_NOT_JSON_FORMAT = {
  code: 'file_not_json_format',
  message: 'File not json format',
};

export class ProductSeed {
  private _prismaClient: PrismaClient;
  private readonly _separatorLength = 60;
  private readonly _dirName = 'data/products_crawl';

  constructor() {
    this._prismaClient = new PrismaClient();
  }

  async main() {
    const dirPath = resolve(__dirname, this._dirName);
    const seedFileNames = this._readFilesFromDir(this._dirName);

    if (seedFileNames.length === 0) {
      throw new NotFoundException(FILE_NOT_FOUND);
    }
    if (seedFileNames.some((fileName) => !fileName.match(/\.json$/gi))) {
      throw new BadRequestException(FILE_NOT_JSON_FORMAT);
    }

    const categoryInputs = seedFileNames
      .map((fileName) => {
        const splits = fileName.match(/^[A-Za-z0-9_-]+/gi);

        return {
          name: splits ? splits[0] : '',
        };
      })
      .filter((categoryName) => categoryName.name !== '');

    const categories: Array<Category> =
      await this._createCategories(categoryInputs);

    const existingProducts = await this._prismaClient.product.findMany();
    const existingBrands = await this._prismaClient.brand.findMany();

    const brandsData: Array<Prisma.BrandCreateInput> = [];
    const cleanedProducts: Array<
      Prisma.ProductCreateInput & {
        brandSlug: string | null;
      }
    > = [];
    const urls: Array<string> = existingProducts.map(
      (product) => product.urlSource,
    );
    const skus: Array<string> = existingProducts.map((product) => product.sku);
    const productSlugs: Array<string> = existingProducts.map(
      (product) => product.slug,
    );
    const brandSlugs: Array<string> = existingBrands.map((brand) => brand.slug);

    categories.forEach((category, index) => {
      const filePath = `${dirPath}/${seedFileNames[index]}`;
      const rawProductsPerCategory = this._readFileContent(filePath);

      const requiredListFields = ['images'];
      const requiredStringFields = [
        'title',
        'url_source',
        'sku',
        'specifications',
      ];

      for (const rawProduct of rawProductsPerCategory) {
        let isValid =
          !this._isEmptyObject(rawProduct) &&
          this._isConfirmedRequiredListFields(requiredListFields, rawProduct) &&
          this._isConfirmedRequiredStringFields(
            requiredStringFields,
            rawProduct,
          );

        const curUrl = rawProduct.url_source as string;
        const curSku = rawProduct.sku as string;

        if (isValid) {
          if (urls.includes(curUrl)) {
            isValid = false;
          } else {
            urls.push(curUrl);
          }
        }
        if (isValid) {
          if (skus.includes(curSku)) {
            isValid = false;
          } else {
            skus.push(curSku);
          }
        }

        if (isValid) {
          const brandName = rawProduct.brand as string;
          let brandSlug: string | null = null;

          if (brandName && brandName !== '') {
            const brandIndex = brandsData.findIndex(
              (brand) => brand.name === brandName,
            );
            if (brandIndex !== -1) {
              brandSlug = brandsData[brandIndex].slug;
            } else {
              brandSlug = this._generateUniqueSlug(brandName, brandSlugs);

              brandSlugs.push(brandSlug);
              brandsData.push({
                name: brandName,
                slug: brandSlug,
              });
            }
          }

          const productSlug = this._generateUniqueSlug(
            rawProduct.title as string,
            productSlugs,
          );
          productSlugs.push(productSlug);

          cleanedProducts.push({
            title: rawProduct.title as string,
            urlSource: curUrl,
            description: rawProduct.description,
            sku: curSku,
            price: rawProduct.price,
            features: rawProduct.features,
            specifications: rawProduct.specifications as string,
            images: rawProduct.images as Array<string>,
            warranty: rawProduct.warranty,
            deliveryInformation: rawProduct.delivery_information,
            category: {
              connect: {
                id: category.id,
              },
            },
            brandSlug,
            slug: productSlug,
          });
        }
      }
    });

    const brands: Array<Brand> = await this._createBrands(brandsData);
    const brandMapping: Record<string, string> = {};
    for (const brand of brands) {
      brandMapping[brand.slug] = brand.id;
    }

    const productsData: Array<Prisma.ProductCreateInput> = cleanedProducts.map(
      (product) => {
        const { brandSlug, ...formattedData } = product;

        return brandSlug
          ? {
              ...formattedData,
              brand: {
                connect: {
                  id: brandMapping[brandSlug],
                },
              },
            }
          : {
              ...formattedData,
            };
      },
    );

    await this._createProducts(productsData);
  }

  async run() {
    try {
      await this.main();
    } catch (error) {
      console.error(error);
    } finally {
      await this._prismaClient.$disconnect();
    }
  }

  private _readFilesFromDir(dirName: string): Array<string> {
    const dirPath = resolve(__dirname, dirName);
    if (!this._isDirectory(dirPath)) {
      throw new NotFoundException(DIR_NOT_FOUND);
    }
    const fileNames = readdirSync(dirPath);

    return fileNames;
  }

  private _generateUniqueSlug(
    name: string,
    existingSlugs: Array<string>,
  ): string {
    const originalSlug = this._generateSlug(name);
    let slug = originalSlug;

    while (existingSlugs.includes(slug)) {
      slug = `${originalSlug}-${this._generateRandomString(8)}`;
    }

    return slug;
  }

  private _readFileContent(filePath: string): Array<RawProductData> {
    const data = readFileSync(filePath);

    const parsedData = JSON.parse(data.toString());

    return parsedData;
  }

  private async _createCategories(
    categoryInputs: Array<CreateCategoryInput>,
  ): Promise<Array<Category>> {
    const existingCategories = await this._prismaClient.category.findMany();
    const existingCategorySlugs: Array<string> = existingCategories.map(
      (category) => category.slug,
    );

    const categoriesData: Array<Prisma.CategoryCreateInput> =
      categoryInputs.map((categoryInput, index) => {
        const slug = this._generateUniqueSlug(
          categoryInput.name,
          existingCategorySlugs,
        );
        existingCategorySlugs.push(slug);

        return {
          name: this._generateBeautiString(categoryInput.name, /[-_.]/gi),
          slug,
          ordering: index,
        };
      });

    const categories: Array<Category> = [];

    for (let i = 0; i < categoriesData.length; i++) {
      const categoryData = categoriesData[i];
      const categoryDb = await this._prismaClient.category.findFirst({
        where: {
          name: categoriesData[i].name,
        },
      });
      if (categoryDb) {
        categories.push(categoryDb);
        console.log(
          `[${i + 1}/${categoriesData.length}] Existed - Skipping category: ${categoryData.name}`,
        );
        continue;
      }
      console.log(
        `[${i + 1}/${categoriesData.length}] Creating category: ${categoryData.name}`,
      );
      const category = await this._prismaClient.category.create({
        data: categoryData,
      });
      categories.push(category);
    }

    this._printSeparatedLine(this._separatorLength, 'Categories completed');

    return categories;
  }

  private async _createBrands(
    brandsData: Array<Prisma.BrandCreateInput>,
  ): Promise<Array<Brand>> {
    const brands: Array<Brand> = [];

    for (let i = 0; i < brandsData.length; i++) {
      const brandData = brandsData[i];
      const brandDb = await this._prismaClient.brand.findFirst({
        where: {
          name: brandData.name,
        },
      });
      if (brandDb) {
        brands.push(brandDb);
        console.log(
          `[${i + 1}/${brandsData.length}] Existed - Skipping brand: ${brandData.name}`,
        );
        continue;
      }
      console.log(
        `[${i + 1}/${brandsData.length}] Creating brand: ${brandData.name}`,
      );
      const brand = await this._prismaClient.brand.create({
        data: brandData,
      });
      brands.push(brand);
    }

    this._printSeparatedLine(this._separatorLength, 'Brands completed');

    return brands;
  }

  private async _createProducts(
    productsData: Array<Prisma.ProductCreateInput>,
  ): Promise<void> {
    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i];
      const productDb = await this._prismaClient.product.findFirst({
        where: {
          title: productData.title,
        },
      });
      if (productDb) {
        console.log(
          `[${i + 1}/${productsData.length}] Existed - Skipping product: ${productData.title}`,
        );
        continue;
      }
      console.log(
        `[${i + 1}/${productsData.length}] Creating product: ${productData.title}`,
      );
      await this._prismaClient.product.create({
        data: productData,
      });
    }

    this._printSeparatedLine(this._separatorLength, 'Products completed');
  }

  private _printSeparatedLine(numChars: number, text: string = ''): void {
    console.log(
      `${'='.repeat(numChars / 2)} ${text} ${'='.repeat(numChars / 2)}`,
    );
  }

  private _capitializeString(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private _generateBeautiString(
    str: string,
    separator: string | RegExp = /[-]/gi,
  ): string {
    const words = str.split(separator).filter((word) => word.length > 0);
    const beautiString = words
      .map((word) => this._capitializeString(word))
      .join(' ');

    return beautiString;
  }

  private _isEmptyObject(value: object): boolean {
    for (const key in value) {
      if (Object.hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  private _generateSlug(text: string, options: object = {}): string {
    const slugOptions = this._isEmptyObject(options)
      ? {
          replacement: '-',
          lower: true,
          trim: true,
        }
      : options;
    return slugify(text, slugOptions);
  }

  private _isDirectory(path: string): boolean {
    if (!existsSync(path)) {
      return false;
    }
    return lstatSync(path) ? lstatSync(path).isDirectory() : false;
  }

  private _generateRandomString(length: number): string {
    let characters = '';
    for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); ++i) {
      characters += String.fromCharCode(i);
    }
    for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); ++i) {
      characters += String.fromCharCode(i);
    }
    for (let i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); ++i) {
      characters += String.fromCharCode(i);
    }
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; ++i) {
      result += characters[Math.floor(Math.random() * charactersLength)];
    }
    return result;
  }

  private _isNotEmptyArray(value: any): boolean {
    return Array.isArray(value) && value.length > 0;
  }

  private _isConfirmedRequiredListFields(
    requiredFields: Array<string>,
    data: RawProductData,
  ): boolean {
    return requiredFields.every((field) => this._isNotEmptyArray(data[field]));
  }

  private _isConfirmedRequiredStringFields(
    requiredFields: Array<string>,
    data: RawProductData,
  ): boolean {
    return requiredFields.every((field) => data[field] && data[field] !== '');
  }
}
