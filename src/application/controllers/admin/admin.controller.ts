import { JwtAdminGuard } from '~/application/guards/jwt-admin.guard';
import { RequestUser } from '~/common/decorators';
import { UserProfile } from '~/common/types';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @UseGuards(JwtAdminGuard)
  @Get('me')
  getAdminMe(@RequestUser() user: UserProfile): UserProfile {
    return user;
  }
}
