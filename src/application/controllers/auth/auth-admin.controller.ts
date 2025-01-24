import { LoginResponse } from '~/application/responses';
import { AuthService } from '~/application/services/auth';
import { RequestUser } from '~/common/decorators/request-user.decorator';
import { UserProfile } from '~/common/types';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAdminGuard } from '~/application/guards/local-admin.guard';

@Controller('auth/admin')
export class AuthAdminController {
  constructor(private readonly _authService: AuthService) {}

  @UseGuards(LocalAdminGuard)
  @Post('login')
  login(@RequestUser() user: UserProfile): LoginResponse {
    return this._authService.loginAdmin(user);
  }
}
