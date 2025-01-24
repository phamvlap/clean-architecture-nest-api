import { PrismaService } from '~/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly _prismaService: PrismaService) {}

  async createUser(args: Prisma.UserCreateArgs): Promise<User> {
    return this._prismaService.user.create(args);
  }

  async getFirstUser(args: Prisma.UserFindFirstArgs): Promise<User | null> {
    return this._prismaService.user.findFirst(args);
  }

  async updateUser(args: Prisma.UserUpdateArgs): Promise<User> {
    return this._prismaService.user.update(args);
  }
}
