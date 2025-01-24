import {
  GetStartedDto,
  RegisterCustomerDto,
  getStartedSchema,
  registerCustomerSchema,
} from '~/application/dtos/auth';
import { AuthGetStartedResponse } from '~/application/responses';
import { AuthService } from '~/application/services/auth';
import { ZodValidationPipe } from '~/common/pipes/zod-validation-pipe';
import { Body, Controller, Post } from '@nestjs/common';
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
}
