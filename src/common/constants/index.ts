import { StringValue } from 'ms';

export const DefaultPaginationParams = {
  LIMIT: 10,
  PAGE: 1,
};

export const DefaultBcryptParams = {
  SALT_ROUNDS: 10,
};

export const JwtExpirationTimeConguration = {
  ACCESS_TOKEN_EXPIRES_IN: '1h' as StringValue,
  REFRESH_TOKEN_EXPIRES_IN: '90d' as StringValue,
};

export const StrategyNames = {
  LOCAL_CUSTOMER: 'LOCAL_CUSTOMER',
  LOCAL_ADMIN: 'LOCAL_ADMIN',
  JWT_CUSTOMER: 'JWT_CUSTOMER',
  JWT_ADMIN: 'JWT_ADMIN',
};
