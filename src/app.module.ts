import { BrandsModule } from '~/application/modules/brands.module';
import { CategoriesModule } from '~/application/modules/categories.module';
import { PrismaModule } from '~/infrastructure/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, CategoriesModule, BrandsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
