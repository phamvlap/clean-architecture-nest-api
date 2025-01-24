import * as bcrypt from 'bcryptjs';

export const isMatchingPasswordAndHash = (plainText: string, hash: string) => {
  return bcrypt.compareSync(plainText, hash);
};
