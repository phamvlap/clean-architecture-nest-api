import { JwtCustomerStrategy } from '~/application/controllers/auth/guards/strategies/jwt-customer.strateg';
import { CustomersController } from '~/application/controllers/customers';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CustomersController],
  providers: [JwtCustomerStrategy],
})
export class CustomersModule {}
