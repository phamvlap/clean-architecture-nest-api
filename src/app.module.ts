import { AdminModule } from '~/application/modules/admin.module';
import { AuthModule } from '~/application/modules/auth.module';
import { BrandsModule } from '~/application/modules/brands.module';
import { CategoriesModule } from '~/application/modules/categories.module';
import { CustomersModule } from '~/application/modules/customers.module';
import { ProductsModule } from '~/application/modules/products.module';
import { PrismaModule } from '~/infrastructure/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { HandlebarsModule } from './infrastructure/handlebars/handlebars.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { QueueModule } from './infrastructure/queue/queue.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    AuthModule,
    CustomersModule,
    AdminModule,
    HandlebarsModule,
    MailModule,
    QueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
