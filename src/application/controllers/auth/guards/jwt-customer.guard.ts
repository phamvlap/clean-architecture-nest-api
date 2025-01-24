import { StrategyNames } from '~/common/constants';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCustomerGuard extends AuthGuard(StrategyNames.JWT_CUSTOMER) {}
