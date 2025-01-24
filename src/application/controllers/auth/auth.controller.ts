import {
  GetStartedDto,
  RegisterCustomerDto,
  getStartedSchema,
  registerCustomerSchema,
} from '~/application/dtos/auth';
import { AuthGetStartedResponse } from '~/application/responses';
import { LoginResponse } from '~/application/responses';
import { AuthService } from '~/application/services/auth';
import { RequestUser } from '~/common/decorators/request-user.decorator';
import { ZodValidationPipe } from '~/common/pipes/zod-validation-pipe';
import { UserProfile } from '~/common/types';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { LocalCustomerGuard } from './guards/local-customer.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('get-started')
  async getStarted(
    @Body(new ZodValidationPipe(getStartedSchema)) body: GetStartedDto,
  ): Promise<AuthGetStartedResponse> {
    console.log({ body });
    return this._authService.checkExistedUser(body.email);
  }

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerCustomerSchema))
    registerDto: RegisterCustomerDto,
  ): Promise<User> {
    return this._authService.register(registerDto);
  }

  @UseGuards(LocalCustomerGuard)
  @Post('login')
  login(@RequestUser() user: UserProfile): LoginResponse {
    return this._authService.login(user);
  }
}
