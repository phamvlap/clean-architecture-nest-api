import { StrategyNames } from '~/common/constants';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalCustomerGuard extends AuthGuard(
  StrategyNames.LOCAL_CUSTOMER,
) {}
