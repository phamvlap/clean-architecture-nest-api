import { z } from 'zod';

export const forgotPassword = z.object({
  email: z.string().nonempty().email(),
});

export type ForgotPassword = z.infer<typeof forgotPassword>;
