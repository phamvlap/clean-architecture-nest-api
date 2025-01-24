import { Strategy } from 'passport-local';
import { AuthService } from '~/application/services/auth';
import { StrategyNames } from '~/common/constants';
import { UserProfile } from '~/common/types';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalCustomerStrategy extends PassportStrategy(
  Strategy,
  StrategyNames.LOCAL_CUSTOMER,
) {
  constructor(private readonly _authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserProfile> {
    const user = await this._authService.validateCustomerLogin(email, password);

    return user;
  }
}
