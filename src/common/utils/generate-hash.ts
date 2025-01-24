import * as bcrypt from 'bcryptjs';
import { DefaultBcryptParams } from '~/common/constants';

export const generateHash = (text: string): string => {
  const salt = bcrypt.genSaltSync(DefaultBcryptParams.SALT_ROUNDS);
  const hash = bcrypt.hashSync(text, salt);

  return hash;
};
