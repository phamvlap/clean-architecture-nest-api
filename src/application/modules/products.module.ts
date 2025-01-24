import { ProductsController } from '~/application/controllers/products';
import { ProductsRepository } from '~/application/repositories/products.repository';
import { ProductsService } from '~/application/services/products';
import { Module } from '@nestjs/common';
import { BrandsModule } from './brands.module';
import { CategoriesModule } from './categories.module';

@Module({
  imports: [BrandsModule, CategoriesModule, ProductsModule],
  controllers: [ProductsController],
  providers: [ProductsRepository, ProductsService],
})
export class ProductsModule {}
