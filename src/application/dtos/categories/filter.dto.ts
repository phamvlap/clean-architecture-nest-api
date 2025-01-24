import { z } from 'zod';

export const filterCategorySchema = z.object({
  search: z.string().optional(),
  sort: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(
      z.array(
        z.object({
          field: z.enum(['name']),
          value: z.enum(['asc', 'desc']),
        }),
      ),
    )
    .optional(),
});

export type FilterCategoryDto = z.infer<typeof filterCategorySchema>;
