import { AdminController } from '~/application/controllers/admin';
import { JwtAdminStrategy } from '~/application/controllers/auth/guards/strategies/jwt-admin.strategy';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [JwtAdminStrategy],
})
export class AdminModule {}
