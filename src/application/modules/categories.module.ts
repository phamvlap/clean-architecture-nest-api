import { CategoriesController } from '~/application/controllers/categories';
import { CategoriesRepository } from '~/application/repositories/categories.repository';
import { CategoriesService } from '~/application/services/categories';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesRepository, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
