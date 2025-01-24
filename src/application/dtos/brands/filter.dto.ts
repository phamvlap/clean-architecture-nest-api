import { z } from 'zod';

export const filterBrandSchema = z.object({
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

export type FilterBrandDto = z.infer<typeof filterBrandSchema>;
