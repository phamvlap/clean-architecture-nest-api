import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { InternalServerErrorException } from '@nestjs/common';
import { EnvironmentVariables, ValidationSchema } from './validation-schema';

export const sanitizeConfig = (
  config: Record<string, any>,
): EnvironmentVariables => {
  const { success, error, data } = ValidationSchema.safeParse(config);

  if (!success) {
    throw new InternalServerErrorException(error.message);
  }

  return data;
};

export const readEnvironmentVariablesConfig = (
  path: string,
): EnvironmentVariables => {
  const envFileContent = readFileSync(path, { encoding: 'utf-8' });
  const envVariables = dotenv.parse(envFileContent);

  const config = sanitizeConfig(envVariables);

  return config;
};

export const getCurrentEnvFilePath = (): string => {
  return resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'local'}`);
};
