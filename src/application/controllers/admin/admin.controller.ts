import { JwtAdminGuard } from '~/application/guards/jwt-admin.guard';
import { RequestUser } from '~/common/decorators';
import { Version } from '~/common/enums';
import { UserProfile } from '~/common/types';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller({ path: 'admin', version: [Version.V1] })
export class AdminController {
  @UseGuards(JwtAdminGuard)
  @Get('me')
  getAdminMe(@RequestUser() user: UserProfile): UserProfile {
    return user;
  }
}
