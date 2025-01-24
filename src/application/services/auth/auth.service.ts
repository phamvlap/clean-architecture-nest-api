import { RegisterCustomerDto } from '~/application/dtos/auth';
import { UsersRepository } from '~/application/repositories/users.repository';
import { AuthGetStartedResponse } from '~/application/responses';
import { generateHash } from '~/common/utils';
import { CUSTOMER_ALREDADY_EXIST } from '~/content/errors/customer.error';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountStatus, Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly _usersRepository: UsersRepository) {}

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
}
