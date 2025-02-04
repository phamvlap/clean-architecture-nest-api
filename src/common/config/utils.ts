import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
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

export const readEnvironmentVariablesConfig = async (
  path: string,
): Promise<EnvironmentVariables> => {
  const envFileContent = await readFile(path, { encoding: 'utf-8' });
  const envVariables = dotenv.parse(envFileContent);

  const config = sanitizeConfig(envVariables);

  return config;
};

export const getCurrentEnvFilePath = (): string => {
  return resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'local'}`);
};
