import { UserProfile } from '~/common/types';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RequestUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserProfile => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
