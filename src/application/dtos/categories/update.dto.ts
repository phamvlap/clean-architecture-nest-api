import { z } from 'zod';

export const updateCategorySchema = z.object({
  name: z.string().nonempty().optional(),
  ordering: z.number().int().positive().optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
