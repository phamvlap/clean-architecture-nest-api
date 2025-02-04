import {
  AuthAdminController,
  AuthController,
} from '~/application/controllers/auth';
import { LocalAdminStrategy } from '~/application/guards/strategies/local-admin.strategy';
import { LocalCustomerStrategy } from '~/application/guards/strategies/local-customer.strategy';
import { UsersRepository } from '~/application/repositories/users.repository';
import { AuthQueue, AuthService } from '~/application/services/auth';
import { HandlebarsModule } from '~/infrastructure/handlebars/handlebars.module';
import { QueueModule } from '~/infrastructure/queue/queue.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [HandlebarsModule, QueueModule.register()],
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
