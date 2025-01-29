import {
  ForgotPassword,
  GetStartedDto,
  RegisterCustomerDto,
  ResetPasswordDto,
  forgotPassword,
  getStartedSchema,
  registerCustomerSchema,
  resetPasswordSchema,
} from '~/application/dtos/auth';
import { LocalCustomerGuard } from '~/application/guards/local-customer.guard';
import { AuthGetStartedResponse } from '~/application/responses';
import { LoginResponse } from '~/application/responses';
import { AuthService } from '~/application/services/auth';
import { RequestUser } from '~/common/decorators/request-user.decorator';
import { ZodValidationPipe } from '~/common/pipes/zod-validation-pipe';
import { UserProfile } from '~/common/types';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

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

  @Post('forgot-password')
  async sendCode(
    @Body(new ZodValidationPipe(forgotPassword)) body: ForgotPassword,
  ): Promise<void> {
    return this._authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema)) body: ResetPasswordDto,
  ): Promise<void> {
    return this._authService.resetPassword(body);
  }
}
