import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().nonempty(),
  ordering: z.number().int().positive().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
