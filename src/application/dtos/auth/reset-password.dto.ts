import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z.string().nonempty().email(),
  code: z.string().nonempty(),
  password: z.string().nonempty().min(8),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
