import { AuthController } from '~/application/controllers/auth';
import { LocalCustomerStrategy } from '~/application/controllers/auth/guards/strategies/local-customer.strategy';
import { UsersRepository } from '~/application/repositories/users.repository';
import { AuthService } from '~/application/services/auth';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthController],
  providers: [UsersRepository, AuthService, LocalCustomerStrategy],
})
export class AuthModule {}
