import { JwtCustomerGuard } from '~/application/guards/jwt-customer.guard';
import { RequestUser } from '~/common/decorators';
import { Version } from '~/common/enums';
import { UserProfile } from '~/common/types';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller({ path: 'customers', version: [Version.V1] })
export class CustomersController {
  @UseGuards(JwtCustomerGuard)
  @Get('me')
  getMe(@RequestUser() user: UserProfile): UserProfile {
    return user;
  }
}
