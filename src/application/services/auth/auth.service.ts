import { sign } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { RegisterCustomerDto } from '~/application/dtos/auth';
import { UsersRepository } from '~/application/repositories/users.repository';
import { AuthGetStartedResponse, LoginResponse } from '~/application/responses';
import { JwtExpirationTimeConguration } from '~/common/constants';
import { TokenType, UserRole } from '~/common/enums';
import { SignatureData, UserProfile } from '~/common/types';
import { generateHash, isMatchingPasswordAndHash } from '~/common/utils';
import { AUTH_FORBIDDEN, AUTH_LOGIN_FAILED } from '~/content/errors/auth.error';
import { CUSTOMER_ALREDADY_EXIST } from '~/content/errors/customer.error';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AccountStatus, Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  private _auth: {
    [key in UserRole]: {
      [token in TokenType]: {
        secretKey: string;
        expiresIn: StringValue;
      };
    };
  };

  constructor(private readonly _usersRepository: UsersRepository) {
    this._auth = {
      [UserRole.CUSTOMER]: {
        [TokenType.ACCESS]: {
          secretKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
          expiresIn: JwtExpirationTimeConguration.ACCESS_TOKEN_EXPIRES_IN,
        },
        [TokenType.REFRESH]: {
          secretKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
          expiresIn: JwtExpirationTimeConguration.REFRESH_TOKEN_EXPIRES_IN,
        },
      },
      [UserRole.ADMIN]: {
        [TokenType.ACCESS]: {
          secretKey: process.env.ADMIN_JWT_ACCESS_TOKEN_SECRET_KEY as string,
          expiresIn: JwtExpirationTimeConguration.ACCESS_TOKEN_EXPIRES_IN,
        },
        [TokenType.REFRESH]: {
          secretKey: process.env.ADMIN_JWT_REFRESH_TOKEN_SECRET_KEY as string,
          expiresIn: JwtExpirationTimeConguration.REFRESH_TOKEN_EXPIRES_IN,
        },
      },
    };
  }

  async checkExistedUser(email: string): Promise<AuthGetStartedResponse> {
    const user = await this._usersRepository.getFirstUser({
      where: {
        email,
      },
    });

    return {
      existed: !!user,
    };
  }

  async register(payload: RegisterCustomerDto): Promise<User> {
    const existingUser = await this._usersRepository.getFirstUser({
      where: {
        email: payload.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException(CUSTOMER_ALREDADY_EXIST);
    }

    const passwordHash = generateHash(payload.password);

    const data: Prisma.UserCreateInput = {
      ...payload,
      password: passwordHash,
      status: AccountStatus.ACTIVE,
      isCustomer: true,
    };

    const user = await this._usersRepository.createUser({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
      },
      data,
    });

    return user;
  }

  async validateCustomerLogin(
    email: string,
    password: string,
  ): Promise<UserProfile> {
    const user = await this._usersRepository.getFirstUser({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        password: true,
        status: true,
        isCustomer: true,
      },
    });

    if (!user || !user.isCustomer || user.status === AccountStatus.INACTIVE) {
      throw new BadRequestException(AUTH_LOGIN_FAILED);
    }

    const { password: passwordHash, ...userProfile } = user;

    if (!isMatchingPasswordAndHash(password, passwordHash)) {
      throw new BadRequestException(AUTH_LOGIN_FAILED);
    }

    return userProfile;
  }

  login(user: UserProfile): LoginResponse {
    const data: SignatureData = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = sign(data, this._auth.CUSTOMER.ACCESS.secretKey, {
      expiresIn: this._auth.CUSTOMER.ACCESS.expiresIn,
    });
    const refreshToken = sign(data, this._auth.CUSTOMER.REFRESH.secretKey, {
      expiresIn: this._auth.CUSTOMER.REFRESH.expiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateCustomerProfile(id: string): Promise<UserProfile> {
    const user = await this._usersRepository.getFirstUser({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isCustomer: true,
        status: true,
      },
    });

    if (!user || !user.isCustomer || user.status === AccountStatus.INACTIVE) {
      throw new ForbiddenException(AUTH_FORBIDDEN);
    }

    return user as UserProfile;
  }

  async validateLoginAdmin(
    email: string,
    password: string,
  ): Promise<UserProfile> {
    const user = await this._usersRepository.getFirstUser({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        password: true,
        status: true,
        isAdmin: true,
      },
    });

    if (!user || !user.isAdmin || user.status === AccountStatus.INACTIVE) {
      throw new BadRequestException(AUTH_LOGIN_FAILED);
    }

    const { password: passwordHash, ...userProfile } = user;

    if (!isMatchingPasswordAndHash(password, passwordHash)) {
      throw new BadRequestException(AUTH_LOGIN_FAILED);
    }

    return userProfile;
  }

  loginAdmin(user: UserProfile): LoginResponse {
    const data: SignatureData = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = sign(data, this._auth.ADMIN.ACCESS.secretKey, {
      expiresIn: this._auth.ADMIN.ACCESS.expiresIn,
    });
    const refreshToken = sign(data, this._auth.ADMIN.REFRESH.secretKey, {
      expiresIn: this._auth.ADMIN.REFRESH.expiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAdminProfile(id: string): Promise<UserProfile> {
    const user = await this._usersRepository.getFirstUser({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isAdmin: true,
        status: true,
      },
    });

    if (!user || !user.isAdmin || user.status === AccountStatus.INACTIVE) {
      throw new ForbiddenException(AUTH_FORBIDDEN);
    }

    return user as UserProfile;
  }
}
