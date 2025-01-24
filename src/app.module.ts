import { AuthModule } from '~/application/modules/auth.module';
import { BrandsModule } from '~/application/modules/brands.module';
import { CategoriesModule } from '~/application/modules/categories.module';
import { ProductsModule } from '~/application/modules/products.module';
import { PrismaModule } from '~/infrastructure/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
