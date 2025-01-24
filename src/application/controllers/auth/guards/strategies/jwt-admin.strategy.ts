import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '~/application/services/auth';
import { StrategyNames } from '~/common/constants';
import { SignatureData, UserProfile } from '~/common/types';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(
  Strategy,
  StrategyNames.JWT_ADMIN,
) {
  constructor(private readonly _authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ADMIN_JWT_ACCESS_TOKEN_SECRET_KEY as string,
    });
  }

  async validate(payload: SignatureData): Promise<UserProfile> {
    const userProfile = await this._authService.validateAdminProfile(
      payload.sub,
    );

    return userProfile;
  }
}
