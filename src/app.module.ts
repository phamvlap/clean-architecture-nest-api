import { AdminModule } from '~/application/modules/admin.module';
import { AuthModule } from '~/application/modules/auth.module';
import { BrandsModule } from '~/application/modules/brands.module';
import { CategoriesModule } from '~/application/modules/categories.module';
import { CustomersModule } from '~/application/modules/customer.module';
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
    CustomersModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
