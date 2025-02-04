import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '~/application/services/auth';
import { EnvironmentVariables } from '~/common/config/validation-schema';
import { StrategyNames } from '~/common/constants';
import { SignatureData, UserProfile } from '~/common/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtCustomerStrategy extends PassportStrategy(
  Strategy,
  StrategyNames.JWT_CUSTOMER,
) {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: SignatureData): Promise<UserProfile> {
    const userProfile = await this._authService.validateCustomerProfile(
      payload.sub,
    );

    return userProfile;
  }
}
