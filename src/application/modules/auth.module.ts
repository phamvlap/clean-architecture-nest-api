import { AuthController } from '~/application/controllers/auth';
import { UsersRepository } from '~/application/repositories/users.repository';
import { AuthService } from '~/application/services/auth';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthController],
  providers: [UsersRepository, AuthService],
})
export class AuthModule {}
