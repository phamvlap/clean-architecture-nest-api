import { StrategyNames } from '~/common/constants';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAdminGuard extends AuthGuard(StrategyNames.LOCAL_ADMIN) {}
