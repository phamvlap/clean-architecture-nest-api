import { LocalAdminGuard } from '~/application/guards/local-admin.guard';
import { LoginResponse } from '~/application/responses';
import { AuthService } from '~/application/services/auth';
import { RequestUser } from '~/common/decorators';
import { Version } from '~/common/enums';
import { UserProfile } from '~/common/types';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller({ path: 'auth/admin', version: [Version.V1] })
export class AuthAdminController {
  constructor(private readonly _authService: AuthService) {}

  @UseGuards(LocalAdminGuard)
  @Post('login')
  login(@RequestUser() user: UserProfile): LoginResponse {
    return this._authService.loginAdmin(user);
  }
}
