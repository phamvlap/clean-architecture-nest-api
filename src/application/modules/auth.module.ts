import {
  AuthAdminController,
  AuthController,
} from '~/application/controllers/auth';
import { LocalAdminStrategy } from '~/application/guards/strategies/local-admin.strategy';
import { LocalCustomerStrategy } from '~/application/guards/strategies/local-customer.strategy';
import { UsersRepository } from '~/application/repositories/users.repository';
import { AuthQueue, AuthService } from '~/application/services/auth';
import { HandlebarsModule } from '~/infrastructure/handlebars/handlebars.module';
import { MailModule } from '~/infrastructure/mail/mail.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [HandlebarsModule, MailModule],
  controllers: [AuthController, AuthAdminController],
  providers: [
    UsersRepository,
    AuthService,
    LocalCustomerStrategy,
    LocalAdminStrategy,
    AuthQueue,
  ],
  exports: [AuthService],
})
export class AuthModule {}
