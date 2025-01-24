import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().nonempty(),
});

export type CreateBrandDto = z.infer<typeof createBrandSchema>;
