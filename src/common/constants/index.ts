import { StringValue } from 'ms';

export const DEFAULT_NODE_ENV = 'local';
export const TIME_TO_LIVE_OF_SECRET_CODE_FOR_RESETING_PASSWORD = 5 * 60 * 1000;

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

export const QueueConsts = {
  AUTH_QUEUE: 'AUTH_QUEUE',
};

export const QueueJobConsts = {
  SEND_SECRET_CODE: 'SEND_SECRET_CODE',
};

export const TransportProviders = {
  GMAIL: 'gmail',
};

export const LocalStrategyValidationFields = {
  ADMIN: {
    USERNAME: 'email',
    PASSWORD: 'password',
  },
  CUSTOMER: {
    USERNAME: 'email',
    PASSWORD: 'password',
  },
};
