import { BrandsController } from '~/application/controllers/brands';
import { BrandsRepository } from '~/application/repositories/brands.repository';
import { BrandsService } from '~/application/services/brands/brands.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [BrandsController],
  providers: [BrandsRepository, BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
