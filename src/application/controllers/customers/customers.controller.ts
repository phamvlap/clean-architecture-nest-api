import { JwtCustomerGuard } from '~/application/guards/jwt-customer.guard';
import { RequestUser } from '~/common/decorators/request-user.decorator';
import { UserProfile } from '~/common/types';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('customers')
export class CustomersController {
  @UseGuards(JwtCustomerGuard)
  @Get('me')
  getMe(@RequestUser() user: UserProfile): UserProfile {
    return user;
  }
}
