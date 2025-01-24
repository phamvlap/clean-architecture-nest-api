import {
  AuthAdminController,
  AuthController,
} from '~/application/controllers/auth';
import { LocalAdminStrategy } from '~/application/guards/strategies/local-admin.strategy';
import { LocalCustomerStrategy } from '~/application/guards/strategies/local-customer.strategy';
import { UsersRepository } from '~/application/repositories/users.repository';
import { AuthService } from '~/application/services/auth';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthController, AuthAdminController],
  providers: [
    UsersRepository,
    AuthService,
    LocalCustomerStrategy,
    LocalAdminStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
