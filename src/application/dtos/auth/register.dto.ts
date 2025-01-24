import validator from 'validator';
import { z } from 'zod';

export const registerCustomerSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().nonempty().email(),
  phoneNumber: z
    .string()
    .nonempty()
    .max(17)
    .refine((value) => validator.isMobilePhone(value, 'any'), {
      message: 'Invalid phone number',
    })
    .optional(),
  password: z.string().nonempty().min(8),
});

export type RegisterCustomerDto = z.infer<typeof registerCustomerSchema>;
