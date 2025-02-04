import { AdminModule } from '~/application/modules/admin.module';
import { AuthModule } from '~/application/modules/auth.module';
import { BrandsModule } from '~/application/modules/brands.module';
import { CategoriesModule } from '~/application/modules/categories.module';
import { CustomersModule } from '~/application/modules/customers.module';
import { ProductsModule } from '~/application/modules/products.module';
import { ValidationSchema } from '~/common/config/validation-schema';
import { HandlebarsModule } from '~/infrastructure/handlebars/handlebars.module';
import { MailModule } from '~/infrastructure/mail/mail.module';
import { PrismaModule } from '~/infrastructure/prisma/prisma.module';
import { QueueModule } from '~/infrastructure/queue/queue.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
      validate: (value: Record<string, any>) => ValidationSchema.parse(value),
    }),
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
