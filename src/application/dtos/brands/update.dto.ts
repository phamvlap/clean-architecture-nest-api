import { z } from 'zod';

export const updateBrandSchema = z.object({
  name: z.string().nonempty().optional(),
});

export type UpdateBrandDto = z.infer<typeof updateBrandSchema>;
