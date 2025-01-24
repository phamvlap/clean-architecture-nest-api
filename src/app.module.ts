import { CategoriesModule } from '~/application/modules/categories.module';
import { PrismaModule } from '~/infrastructure/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
