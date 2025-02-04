import { z } from 'zod';

export const ValidationSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  JWT_ACCESS_TOKEN_SECRET_KEY: z.string().nonempty(),
  JWT_REFRESH_TOKEN_SECRET_KEY: z.string().nonempty(),
  ADMIN_JWT_ACCESS_TOKEN_SECRET_KEY: z.string().nonempty(),
  ADMIN_JWT_REFRESH_TOKEN_SECRET_KEY: z.string().nonempty(),
  REDIS_HOST: z.string().nonempty(),
  REDIS_PORT: z
    .string()
    .nonempty()
    .transform((value) => +value)
    .pipe(z.number().int().positive()),
  GOOGLE_OAUTH_CLIENT_ID: z.string().nonempty(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().nonempty(),
  GOOGLE_OAUTH_REFRESH_TOKEN: z.string().nonempty(),
  SENDER_EMAIL: z.string().nonempty(),
});

export type EnvironmentVariables = z.infer<typeof ValidationSchema>;
