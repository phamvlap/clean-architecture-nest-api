import { CustomersController } from '~/application/controllers/customers';
import { JwtCustomerStrategy } from '~/application/guards/strategies/jwt-customer.strategy';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CustomersController],
  providers: [JwtCustomerStrategy],
})
export class CustomersModule {}
